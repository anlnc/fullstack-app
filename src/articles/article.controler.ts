import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
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
    if (!user) {
      throw new NotFoundException();
    }
    await this.articlesService.create(createArticleDto, user.id);
    return new ApiResponse(HttpStatus.CREATED, { success: true });
  }

  @Put("/:article_id")
  async updateArticle(
    @Body() updateArticleDto: UpdateArticleDto,
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ApiResponse> {
    const articleToUpdate = await this.articlesService.findOne(articleId);
    if (!articleToUpdate) {
      throw new NotFoundException();
    }
    await this.articlesService.update(updateArticleDto, articleId);
    return new ApiResponse(HttpStatus.OK, { success: true });
  }

  @Delete("/:article_id/favorite")
  @HttpCode(HttpStatus.OK)
  async unfavoriteArticle(
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ApiResponse> {
    const articleToUnfavorite = await this.articlesService.findOne(articleId);
    if (!articleToUnfavorite) {
      throw new NotFoundException();
    }
    await this.articlesService.unfavoriteArticle(articleId);
    return new ApiResponse(HttpStatus.OK, { success: true });
  }

  @Delete("/:article_id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(@Param("article_id", ParseIntPipe) articleId: number): Promise<ApiResponse> {
    const articleToDelete = await this.articlesService.findOne(articleId);
    if (!articleToDelete) {
      throw new NotFoundException();
    }
    await this.articlesService.delete(articleId);
    return new ApiResponse(HttpStatus.NO_CONTENT, { success: true });
  }

  @Post("/:article_id/favorite")
  @HttpCode(HttpStatus.OK)
  async favoriteArticle(
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ApiResponse> {
    const articleToFavorite = await this.articlesService.findOne(articleId);
    if (!articleToFavorite) {
      throw new NotFoundException();
    }

    await this.articlesService.favoriteArticle(articleToFavorite.id);
    return new ApiResponse(HttpStatus.OK, { success: true });
  }
}
