import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UnauthorizedException,
} from "@nestjs/common";

import { FastifyRequest } from "fastify";
import { ApiResponse } from "src/common/types";
import { ArticleService } from "./article.service";
import { CreateArticleDto, UpdateArticleDto } from "./dto/article.dto";

@Controller("articles")
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}

  @Get()
  async listArticles(): Promise<ApiResponse> {
    const articles = await this.articlesService.listArticles();
    return new ApiResponse(HttpStatus.OK, articles);
  }

  @Post()
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Request() request: FastifyRequest
  ): Promise<ApiResponse> {
    const { user }: Record<string, any> = request;
    if (user?.id) {
      throw new UnauthorizedException();
    }
    const article = await this.articlesService.create(createArticleDto, user.id);
    return new ApiResponse(HttpStatus.CREATED, article);
  }

  @Put("/:article_id")
  async updateArticle(
    @Body() updateArticleDto: UpdateArticleDto,
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ApiResponse> {
    const { title, body } = updateArticleDto;
    if (!title || !body || !articleId) {
      throw new BadRequestException();
    }
    await this.articlesService.update({ title, body }, articleId);
    return new ApiResponse(HttpStatus.OK, { success: true });
  }

  @Delete("/:article_id/favorite")
  @HttpCode(HttpStatus.OK)
  async unfavoriteArticle(
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ApiResponse> {
    if (!articleId) {
      throw new BadRequestException();
    }
    await this.articlesService.unfavorite(articleId);
    return new ApiResponse(HttpStatus.OK, { success: true });
  }

  @Delete("/:article_id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(@Param("article_id", ParseIntPipe) articleId: number): Promise<ApiResponse> {
    if (!articleId) {
      throw new BadRequestException();
    }
    await this.articlesService.delete(articleId);
    return new ApiResponse(HttpStatus.NO_CONTENT, { success: true });
  }

  @Post("/:article_id/favorite")
  @HttpCode(HttpStatus.OK)
  async favoriteArticle(
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ApiResponse> {
    if (!articleId) {
      throw new BadRequestException();
    }
    await this.articlesService.favorite(articleId);
    return new ApiResponse(HttpStatus.OK, { success: true });
  }
}
