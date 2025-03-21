import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../users/users.entity";
import { EmailService } from "../../email/email.service";
import { RegisterUserDto } from "../dto/register-user.dto";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
  });

  describe("register", () => {
    it("should register a new user and send a verification email", async () => {
      const registerUserDto: RegisterUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
      const verificationToken = uuidv4();
      const userDto = {
        id: "1",
        ...registerUserDto,
        password: hashedPassword,
        isVerified: false,
        verificationToken: "token",
      };

      //   const user = this.userRepository.create({
      //     name,
      //     email,
      //     password: hashedPassword,
      //     verificationToken,
      //   });

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
});
