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

import { ApiOkResponse, ApiOperation, ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";
import { ArticleListResponse, ArticleResponse } from "./article.entity";
import { ArticleService } from "./article.service";
import { CreateArticleDto, UpdateArticleDto } from "./dto/article.dto";

@ApiSecurity("access-token")
@ApiTags("Articles")
@Controller("articles")
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}

  @ApiOperation({
    operationId: "list-articles",
    description: "List articles",
  })
  @ApiOkResponse({
    type: ArticleListResponse,
  })
  @Get()
  async listArticles(): Promise<ArticleListResponse> {
    const articles = await this.articlesService.listArticles();
    return new ArticleListResponse(
      HttpStatus.OK,
      articles.map(article => ({
        title: article.title,
        body: article.body,
        favoriteCount: article.favoriteCount,
      }))
    );
  }

  @ApiOperation({
    operationId: "create-article",
    description: "Create article",
  })
  @ApiOkResponse({
    type: ArticleResponse,
  })
  @Post()
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Request() request: FastifyRequest
  ): Promise<ArticleResponse> {
    const { user }: Record<string, any> = request;
    if (!user?.id) {
      throw new UnauthorizedException();
    }
    const article = await this.articlesService.create(createArticleDto, user.id);
    return new ArticleResponse(HttpStatus.CREATED, {
      title: article.title,
      body: article.body,
      favoriteCount: article.favoriteCount,
    });
  }

  @Put("/:article_id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "update-article",
    description: "Update article",
  })
  @ApiOkResponse({
    type: ArticleResponse,
  })
  @ApiParam({ name: "article_id", description: "The ID of the article" })
  async updateArticle(
    @Body() updateArticleDto: UpdateArticleDto,
    @Param("article_id", ParseIntPipe)
    articleId: number
  ): Promise<ArticleResponse> {
    const { title, body } = updateArticleDto ?? {};
    if (!title || !body || !articleId) {
      throw new BadRequestException();
    }
    const article = await this.articlesService.update({ title, body }, articleId);
    return new ArticleResponse(HttpStatus.OK, {
      title: article.title,
      body: article.body,
      favoriteCount: article.favoriteCount,
    });
  }

  @Delete("/:article_id/favorite")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "unfavorite-article",
    description: "Unfavorite article",
  })
  @ApiOkResponse({
    type: ArticleResponse,
  })
  @ApiParam({ name: "article_id", description: "The ID of the article" })
  async unfavoriteArticle(
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ArticleResponse> {
    if (!articleId) {
      throw new BadRequestException();
    }
    const article = await this.articlesService.unfavorite(articleId);
    return new ArticleResponse(HttpStatus.OK, {
      title: article.title,
      body: article.body,
      favoriteCount: article.favoriteCount,
    });
  }

  @Delete("/:article_id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: "article_id", description: "The ID of the article" })
  async deleteArticle(
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ArticleResponse> {
    if (!articleId) {
      throw new BadRequestException();
    }
    const article = await this.articlesService.delete(articleId);
    return new ArticleResponse(HttpStatus.OK, {
      title: article.title,
      body: article.body,
      favoriteCount: article.favoriteCount,
    });
  }

  @Post("/:article_id/favorite")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ArticleResponse,
  })
  @ApiOperation({
    operationId: "favorite-article",
    description: "Favorite article",
  })
  @ApiOkResponse({
    type: ArticleResponse,
  })
  @ApiParam({ name: "article_id", description: "The ID of the article" })
  async favoriteArticle(
    @Param("article_id", ParseIntPipe) articleId: number
  ): Promise<ArticleResponse> {
    if (!articleId) {
      throw new BadRequestException();
    }
    const article = await this.articlesService.favorite(articleId);
    return new ArticleResponse(HttpStatus.OK, {
      title: article.title,
      body: article.body,
      favoriteCount: article.favoriteCount,
    });
  }
}
