import { Body, Controller, HttpCode, HttpStatus, Post, Response } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { Public } from "src/public.decorator";
import { AuthService } from "./auth.service";
import { AuthResponse } from "./auth.entity";
import { LoginDto } from "./dto/auth.dto";

@ApiTags("Auth")
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({
    operationId: "login",
    description: "User login",
  })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) response: FastifyReply
  ): Promise<AuthResponse> {
    const token = await this.authService.login(loginDto);
    response.setCookie("token", token, { httpOnly: true });
    return new AuthResponse(HttpStatus.OK, { token });
  }
}
