import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dto/users.dto";
import { UserEntity } from "./interfaces/user.interface";

@Injectable()
export class UserService {
  private SALT = 10;
  private FIELDS_TO_RETURN = {
    id: true,
    username: true,
    fullname: true,
    email: true,
  };

  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (!createUserDto) {
      throw new BadRequestException();
    }

    const { email, username, fullname, password } = createUserDto;
    if (!email || !username || !fullname || !password) {
      throw new BadRequestException();
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      throw new ConflictException("User already exists");
    }
    const payload = { email, username, fullname, password: await bcrypt.hash(password, this.SALT) };
    try {
      return this.prisma.user.create({
        data: payload,
        select: this.FIELDS_TO_RETURN,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(idToExclude: number): Promise<UserEntity[]> {
    if (!idToExclude) {
      throw new BadRequestException();
    }
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          not: idToExclude,
        },
      },
      select: this.FIELDS_TO_RETURN,
    });
    return users;
  }

  async delete(id: number): Promise<void> {
    if (!id) {
      throw new BadRequestException();
    }
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
