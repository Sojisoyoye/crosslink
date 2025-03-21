import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/users.entity";
import { AppModule } from "../app.module";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User)
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe("api/auth/register (POST)", () => {
    it("should register a new user", async () => {
      const registerUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      const response = await request(app.getHttpServer())
        .post("api/auth/register")
        .send(registerUserDto)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toEqual(registerUserDto.email);
    });

    it("should return 409 if the email is already registered", async () => {
      const registerUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      await userRepository.save(registerUserDto);

      await request(app.getHttpServer())
        .post("api/auth/register")
        .send(registerUserDto)
        .expect(409);
    });
  });

  describe("api/auth/verify-email (GET)", () => {
    it("should verify the user email", async () => {
      const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        verificationToken: "valid-token",
      };

      await userRepository.save(user);

      await request(app.getHttpServer())
        .get("api/auth/verify-email?token=valid-token")
        .expect(200)
        .expect({ message: "Email successfully verified" });

      const verifiedUser = await userRepository.findOne({
        where: { email: user.email },
      });
      expect(verifiedUser).not.toBeNull();
      expect(verifiedUser!.isVerified).toBe(true);
      expect(verifiedUser!.verificationToken).toBeNull();
    });

    it("should return 400 if the token is invalid", async () => {
      await request(app.getHttpServer())
        .get("api/auth/verify-email?token=invalid-token")
        .expect(400);
    });
  });
});
