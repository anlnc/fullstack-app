import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { ApiResponse } from "src/common/types";
import { Public } from "src/public.decorator";
import { CreateUserDto } from "./dto/users.dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    await this.usersService.create(createUserDto);
    return new ApiResponse(HttpStatus.CREATED, { success: true });
  }

  @Get()
  async findAll(@Request() request: FastifyRequest): Promise<ApiResponse> {
    const { user }: Record<string, any> = request;
    const users = await this.usersService.findAll(user.id);
    return new ApiResponse(HttpStatus.OK, users);
  }

  @Delete("/:email")
  async delete(
    @Request() request: FastifyRequest,
    @Param("email") email: string
  ): Promise<ApiResponse> {
    const { user: requester }: Record<string, any> = request;

    const userToDelete = await this.usersService.findOne(email);
    if (!userToDelete) {
      throw new NotFoundException();
    }

    // Users can only delete themselves
    if (userToDelete.id === requester.id) {
      throw new BadRequestException();
    }

    await this.usersService.delete(userToDelete.id);
    return new ApiResponse(HttpStatus.OK, { success: true });
  }
}
