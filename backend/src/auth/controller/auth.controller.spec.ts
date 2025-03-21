import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthService } from "../service/auth.service";
import { RegisterUserDto } from "../dto/register-user.dto";
import { User } from "../../users/users.entity";

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
});
