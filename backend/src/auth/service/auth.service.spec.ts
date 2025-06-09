import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { User } from "../../users/users.entity";
import { EmailService } from "../../email/email.service";
import { RegisterUserDto } from "../dto/register-user.dto";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";

// Mock bcrypt to avoid native dependency issues
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve("hashed-password")),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let emailService: EmailService;
  let jwtService: JwtService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("mock-jwt-token"),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: EmailService,
          useValue: {
            sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    emailService = module.get<EmailService>(EmailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe("register", () => {
    it("should register a new user and send a verification email", async () => {
      const registerUserDto: RegisterUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      const userDto = {
        id: "1",
        ...registerUserDto,
        password: "hashed-password",
        isVerified: false,
        verificationToken: "token",
      };

      const user = new User();
      user.id = userDto.id;
      user.name = userDto.name;
      user.email = userDto.email;
      user.password = userDto.password;
      user.isVerified = userDto.isVerified;
      user.verificationToken = userDto.verificationToken;

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
      jest.spyOn(userRepository, "create").mockReturnValue(userDto as User);
      jest.spyOn(userRepository, "save").mockResolvedValue(userDto as User);

      const result = await authService.register(registerUserDto);

      expect(result).toEqual(user);
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it("should throw an error if the email is already registered", async () => {
      const registerUserDto: RegisterUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      jest.spyOn(userRepository, "findOne").mockResolvedValue({} as User);

      await expect(authService.register(registerUserDto)).rejects.toThrow(
        "User with this email already exists"
      );
    });
  });

  describe("verifyEmail", () => {
    it("should verify the user email", async () => {
      const user = new User();
      user.id = "1";
      user.email = "john.doe@example.com";
      user.isVerified = false;
      user.verificationToken = "token";
      user.name = "John Doe";
      user.password = "password";

      jest.spyOn(userRepository, "findOne").mockResolvedValue(user);
      jest.spyOn(userRepository, "save").mockResolvedValue(user);

      await authService.verifyEmail("token");

      expect(user.isVerified).toBe(true);
      expect(user.verificationToken).toBe("");
    });

    it("should throw an error if the token is invalid", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(authService.verifyEmail("invalid-token")).rejects.toThrow(
        "Invalid or expired verification token"
      );
    });
  });

  describe("login", () => {
    it("should return user and access token if credentials are valid", async () => {
      const loginDto = {
        email: "john.doe@example.com",
        password: "password123",
      };

      const user = new User();
      user.id = "1";
      user.email = loginDto.email;
      user.password = "hashed-password";
      user.name = "John Doe";
      user.isVerified = true;
      user.verificationToken = "";

      jest.spyOn(userRepository, "findOne").mockResolvedValue(user);
      // No need to mock bcrypt.compare as it's globally mocked
      jest.spyOn(jwtService, "sign").mockReturnValue("mock-jwt-token");

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        user,
        accessToken: "mock-jwt-token",
      });
    });

    it("should throw UnauthorizedException if user does not exist", async () => {
      const loginDto = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw UnauthorizedException if password is incorrect", async () => {
      const loginDto = {
        email: "john.doe@example.com",
        password: "wrongpassword",
      };

      const user = new User();
      user.email = loginDto.email;
      user.password = "hashed-password";
      user.isVerified = true;

      jest.spyOn(userRepository, "findOne").mockResolvedValue(user);

      // Override the global mock for this test
      const bcrypt = require("bcrypt");
      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw UnauthorizedException if user is not verified", async () => {
      const loginDto = {
        email: "john.doe@example.com",
        password: "password123",
      };

      const user = new User();
      user.email = loginDto.email;
      user.password = "hashed-password";
      user.isVerified = false;

      jest.spyOn(userRepository, "findOne").mockResolvedValue(user);

      // No need to mock bcrypt.compare as the default mock returns true

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
