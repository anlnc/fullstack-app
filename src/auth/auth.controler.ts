import { Body, Controller, HttpCode, HttpStatus, Post, Response } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import ms from "ms";
import { Public } from "src/public.decorator";
import { AuthResponse } from "./auth.entity";
import { AuthService } from "./auth.service";
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
    response.setCookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + ms(process.env.TOKEN_EXPIRE_AFTER)),
    });
    return new AuthResponse(HttpStatus.OK, { token });
  }
}
