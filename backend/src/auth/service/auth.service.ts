import { Injectable, ConflictException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "../dto/register-user.dto";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "../../email/email.service";
import { User } from "../../users/users.entity";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService
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
}
