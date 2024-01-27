import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "src/users/dto/users.dto";
import { UserService } from "src/users/user.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    if (!loginDto) {
      throw new BadRequestException("Email and password are required");
    }

    const { email, password } = loginDto;
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { id: user.id, username: user.username };
    return this.jwtService.signAsync(payload);
  }
}
