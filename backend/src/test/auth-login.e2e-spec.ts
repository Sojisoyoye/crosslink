import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import * as bcrypt from "bcrypt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/users.entity";
import { AppModule } from "../app.module";

describe("AuthController (e2e) - Login", () => {
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

  describe("api/auth/login (POST)", () => {
    it("should login a verified user and return an access token", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      const user = {
        name: "John Doe",
        email: "john.login@example.com",
        password: hashedPassword,
        isVerified: true,
      };

      await userRepository.save(user);

      const response = await request(app.getHttpServer())
        .post("api/auth/login")
        .send({
          email: user.email,
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("name", user.name);
      expect(response.body).toHaveProperty("email", user.email);
    });

    it("should return 401 if user is not verified", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      const user = {
        name: "Jane Doe",
        email: "jane.unverified@example.com",
        password: hashedPassword,
        isVerified: false,
      };

      await userRepository.save(user);

      await request(app.getHttpServer())
        .post("api/auth/login")
        .send({
          email: user.email,
          password: "password123",
        })
        .expect(401);
    });

    it("should return 401 if credentials are invalid", async () => {
      await request(app.getHttpServer())
        .post("api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "wrongpassword",
        })
        .expect(401);
    });
  });
});
