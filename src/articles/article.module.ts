import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ArticleController } from "./article.controler";
import { ArticleService } from "./article.service";

@Module({
  providers: [ArticleService, PrismaService],
  controllers: [ArticleController],
})
export class ArticleModule {}
