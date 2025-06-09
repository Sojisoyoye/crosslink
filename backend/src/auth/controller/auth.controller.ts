import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "../service/auth.service";
import { RegisterUserDto } from "../dto/register-user.dto";
import { LoginDto } from "../dto/login.dto";

@ApiTags("Auth")
@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: "User successfully registered" })
  @ApiResponse({
    status: 409,
    description: "User with this email already exists",
  })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Get("verify-email")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: "Verify user email" })
  @ApiQuery({ name: "token", required: true, type: String })
  @ApiResponse({ status: 200, description: "Email successfully verified" })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired verification token",
  })
  async verifyEmail(@Query("token") token: string) {
    await this.authService.verifyEmail(token);
    return { message: "Email successfully verified" };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login a user" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "User successfully logged in" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);

      const { password, verificationToken, ...userWithoutSensitiveInfo } =
        result.user;

      return {
        ...userWithoutSensitiveInfo,
        accessToken: result.accessToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
