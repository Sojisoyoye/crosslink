import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { TestUser } from "./test-user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class MockAuthService {
  constructor(
    @InjectRepository(TestUser)
    private readonly userRepository: Repository<TestUser>,
    private readonly jwtService: JwtService
  ) {}

  async login(credentials: { email: string; password: string }) {
    const user = await this.userRepository.findOne({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isVerified) {
      throw new UnauthorizedException("User is not verified");
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      name: user.name,
      email: user.email,
    };
  }

  async register(registerUserDto: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const newUser = this.userRepository.create({
      id: uuidv4(),
      name: registerUserDto.name,
      email: registerUserDto.email,
      password: hashedPassword,
      verificationToken: "valid-token", // For testing purposes
      isVerified: false,
    });

    await this.userRepository.save(newUser);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new NotFoundException("Invalid token");
    }

    // Modify the user directly
    user.isVerified = true;
    user.verificationToken = "" as unknown as string; // Empty string as a fallback for SQLite

    // Save the updated user
    await this.userRepository.save(user);

    return { message: "Email successfully verified" };
  }
}
