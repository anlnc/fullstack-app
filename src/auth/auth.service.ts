import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { MissingRequiredArgumentError, NotFoundError, UnauthorizedError } from "src/common/types";
import { UserService } from "src/users/user.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async login({ email, password }: { email: string; password: string }): Promise<string> {
    if (!email || !password) {
      throw new MissingRequiredArgumentError("Email and password are required");
    }

    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) {
      throw new UnauthorizedError();
    }

    const payload = { id: user.id, username: user.username };
    return this.jwtService.signAsync(payload);
  }
}
