import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Query,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { MockAuthService } from "./mock-auth.service";

@Controller("api/auth")
export class MockAuthController {
  constructor(private readonly authService: MockAuthService) {}

  @Post("login")
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      return await this.authService.login(loginDto);
    } catch (error: any) {
      if (error?.message === "User is not verified") {
        throw new UnauthorizedException("User is not verified");
      }
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  @Post("register")
  async register(
    @Body() registerUserDto: { name: string; email: string; password: string }
  ) {
    try {
      return await this.authService.register(registerUserDto);
    } catch (error: any) {
      if (error?.message === "Email already in use") {
        throw new ConflictException("Email already in use");
      }
      throw error;
    }
  }

  @Get("verify-email")
  async verifyEmail(@Query("token") token: string) {
    try {
      return await this.authService.verifyEmail(token);
    } catch (error: any) {
      throw new BadRequestException("Invalid token");
    }
  }
}
