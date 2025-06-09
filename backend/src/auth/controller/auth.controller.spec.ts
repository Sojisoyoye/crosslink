import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthService } from "../service/auth.service";
import { RegisterUserDto } from "../dto/register-user.dto";
import { User } from "../../users/users.entity";
import { UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";

// Mock bcrypt to avoid native dependency issues in tests
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve("hashed-password")),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [
            {
              name: "default",
              ttl: 60,
              limit: 10,
            },
          ],
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            verifyEmail: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const registerUserDto: RegisterUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      const result = {
        id: "1",
        ...registerUserDto,
        isVerified: false,
        verificationToken: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = new User();
      user.id = result.id;
      user.name = result.name;
      user.email = result.email;
      user.password = result.password;
      user.isVerified = result.isVerified;
      user.verificationToken = result.verificationToken;
      user.createdAt = result.createdAt;
      user.updatedAt = result.updatedAt;

      jest.spyOn(authService, "register").mockResolvedValue(user);

      expect(await authController.register(registerUserDto)).toEqual(result);
      expect(authService.register).toHaveBeenCalledWith(registerUserDto);
    });

    it("should throw an error if registration fails", async () => {
      const registerUserDto: RegisterUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      jest
        .spyOn(authService, "register")
        .mockRejectedValue(new Error("Registration failed"));

      await expect(authController.register(registerUserDto)).rejects.toThrow(
        "Registration failed"
      );
    });
  });

  describe("verifyEmail", () => {
    it("should verify the user email", async () => {
      const token = "valid-token";

      jest.spyOn(authService, "verifyEmail").mockResolvedValue(undefined);

      expect(await authController.verifyEmail(token)).toEqual({
        message: "Email successfully verified",
      });
      expect(authService.verifyEmail).toHaveBeenCalledWith(token);
    });

    it("should throw an error if the token is invalid", async () => {
      const token = "invalid-token";

      jest
        .spyOn(authService, "verifyEmail")
        .mockRejectedValue(new Error("Invalid or expired verification token"));

      await expect(authController.verifyEmail(token)).rejects.toThrow(
        "Invalid or expired verification token"
      );
    });
  });

  describe("login", () => {
    it("should return user info and access token on successful login", async () => {
      const loginDto = {
        email: "john.doe@example.com",
        password: "password123",
      };

      const user = new User();
      user.id = "1";
      user.name = "John Doe";
      user.email = "john.doe@example.com";
      user.password = "hashed-password"; // This would be excluded from response
      user.isVerified = true;
      user.verificationToken = "token"; // This would be excluded from response
      user.createdAt = new Date();
      user.updatedAt = new Date();

      const loginResult = {
        user,
        accessToken: "mock-access-token",
      };

      jest.spyOn(authService, "login").mockResolvedValue(loginResult);

      // The controller should exclude password and verificationToken
      const expectedResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accessToken: "mock-access-token",
      };

      expect(await authController.login(loginDto)).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it("should propagate UnauthorizedException from the service", async () => {
      const loginDto = {
        email: "john.doe@example.com",
        password: "wrong-password",
      };

      const unauthorizedException = new UnauthorizedException(
        "Invalid credentials"
      );
      jest.spyOn(authService, "login").mockRejectedValue(unauthorizedException);

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw UnauthorizedException for any other error", async () => {
      const loginDto = {
        email: "john.doe@example.com",
        password: "password123",
      };

      jest
        .spyOn(authService, "login")
        .mockRejectedValue(new Error("Some other error"));

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
