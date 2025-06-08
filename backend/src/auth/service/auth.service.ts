import {
  Injectable,
  ConflictException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "../dto/register-user.dto";
import { LoginDto } from "../dto/login.dto";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "../../email/email.service";
import { User } from "../../users/users.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, name } = registerUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = uuidv4();

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    const savedUser = await this.userRepository.save(user);

    await this.emailService.sendVerificationEmail(email, verificationToken);

    return savedUser;
  }

  async verifyEmail(token: string): Promise<void> {
    this.logger.log(`Attempting to verify email with token: ${token}`);

    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      this.logger.warn(`Invalid or expired verification token: ${token}`);

      throw new Error("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = "";
    await this.userRepository.save(user);

    this.logger.log(`Email verified for user: ${user.email}`);
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ user: User; accessToken: string }> {
    const { email, password } = loginDto;

    this.logger.log(`Attempting login for user: ${email}`);

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isVerified) {
      this.logger.warn(`Unverified user attempting to login: ${email}`);
      throw new UnauthorizedException("Please verify your email first");
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`User logged in successfully: ${email}`);

    return {
      user,
      accessToken,
    };
  }
}
