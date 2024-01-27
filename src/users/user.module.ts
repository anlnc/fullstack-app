import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UserController } from "./user.controler";
import { UserService } from "./user.service";

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
