import { Body, HttpCode, HttpStatus, Post, Response, Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/users/dto/users.dto";
import { ApiResponse } from "src/common/types";
import { FastifyReply } from "fastify";
import { Public } from "src/public.decorator";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) response: FastifyReply
  ): Promise<ApiResponse> {
    const token = await this.authService.login(loginDto);
    response.setCookie("token", token, { httpOnly: true });
    return new ApiResponse(HttpStatus.OK, { success: true });
  }
}
