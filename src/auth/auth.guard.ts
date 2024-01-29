import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { Request } from "express";
import { IS_PUBLIC_KEY } from "src/common/constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  private getBearerToken(request: Request): string {
    const authorization = request.headers.authorization || request.headers.Authorization;
    if (!authorization || typeof authorization !== "string") {
      return;
    }
    const token = authorization.split(" ")[1];
    return token;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.getBearerToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_PUBLIC_KEY,
      });
      request["user"] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
