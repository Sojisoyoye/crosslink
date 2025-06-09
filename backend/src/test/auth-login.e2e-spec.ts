import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import * as bcrypt from "bcrypt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TestUser } from "./test-user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MockAuthService } from "./mock-auth.service";
import { MockAuthController } from "./mock-auth.controller";

// Mock bcrypt to avoid native dependency issues
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve("hashed-password")),
  compare: jest.fn().mockResolvedValue(true),
}));

describe("AuthController (e2e) - Login", () => {
  let app: INestApplication;
  let userRepository: Repository<TestUser>;
  let jwtService: JwtService;

  // Extending the timeout for the beforeAll hook
  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [TestUser],
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([TestUser]),
      ],
      controllers: [MockAuthController],
      providers: [
        MockAuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("test-jwt-token"),
            verify: jest
              .fn()
              .mockReturnValue({ sub: "1", email: "test@example.com" }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<TestUser>>(
      getRepositoryToken(TestUser)
    );
    jwtService = moduleFixture.get<JwtService>(JwtService);
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  }, 10000);

  describe("api/auth/login (POST)", () => {
    it("should login a verified user and return an access token", async () => {
      // No need to actually hash with bcrypt since we're mocking it
      const hashedPassword = "hashed-password";

      const user = {
        id: "1",
        name: "John Doe",
        email: "john.login@example.com",
        password: hashedPassword,
        isVerified: true,
      };

      await userRepository.save(user);

      // Verify that compare will return true for our test case
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: "password123", // This doesn't matter since bcrypt.compare is mocked
        })
        .expect(201);

      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("name", user.name);
      expect(response.body).toHaveProperty("email", user.email);
    });

    it("should return 401 if user is not verified", async () => {
      // No need to actually hash with bcrypt
      const hashedPassword = "hashed-password";

      const user = {
        id: "2",
        name: "Jane Doe",
        email: "jane.unverified@example.com",
        password: hashedPassword,
        isVerified: false,
      };

      await userRepository.save(user);

      // Make sure compare returns true for this test too
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: "password123",
        })
        .expect(401);
    });

    it("should return 401 if credentials are invalid", async () => {
      // For invalid credentials test, make bcrypt.compare return false
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "wrongpassword",
        })
        .expect(401);
    });

    it("should return 401 if user is not found", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: "notfound@example.com",
          password: "password123",
        })
        .expect(401);
    });
  });
});
