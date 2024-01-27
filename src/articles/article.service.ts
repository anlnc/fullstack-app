import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Article } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { CreateArticleDto, UpdateArticleDto } from "./dto/article.dto";

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  // @TODO: handle pagination
  async listArticles(): Promise<Article[]> {
    try {
      return this.prisma.article.findMany({ orderBy: { createdAt: "desc" } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(articleId: number): Promise<Article> {
    if (!articleId) {
      throw new BadRequestException();
    }

    try {
      return this.prisma.article.findUnique({ where: { id: articleId } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async create(createArticleDto: CreateArticleDto, authorId: number): Promise<Article> {
    if (!createArticleDto || !authorId) {
      throw new BadRequestException();
    }

    const { title, body } = createArticleDto;
    if (!title || !body) {
      throw new BadRequestException();
    }

    const payload = { title, body, authorId };
    try {
      const article = await this.prisma.article.create({
        data: payload,
      });
      return article;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(updateArticleDto: UpdateArticleDto, articleId: number): Promise<Article> {
    if (!updateArticleDto || !articleId) {
      throw new BadRequestException();
    }

    const { title, body } = updateArticleDto;
    if (!title || !body) {
      throw new BadRequestException();
    }
    const payload = { title, body, updatedAt: new Date() };
    try {
      const updatedArticle = await this.prisma.article.update({
        where: { id: articleId },
        data: payload,
      });
      return updatedArticle;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(articleId: number): Promise<void> {
    if (!articleId) {
      throw new BadRequestException();
    }
    try {
      await this.prisma.article.delete({
        where: { id: articleId },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async favoriteArticle(articleId: number): Promise<Article> {
    if (!articleId) {
      throw new BadRequestException();
    }
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException();
    }
    const currentFavoriteCount = article.favoriteCount;
    const payload = { favoriteCount: currentFavoriteCount + 1, updatedAt: new Date() };
    try {
      const likedArticle = await this.prisma.article.update({
        where: { id: articleId },
        data: payload,
      });
      return likedArticle;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async unfavoriteArticle(articleId: number): Promise<Article> {
    if (!articleId) {
      throw new BadRequestException();
    }
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException();
    }
    const currentFavoriteCount = article.favoriteCount;
    const payload = { favoriteCount: currentFavoriteCount - 1, updatedAt: new Date() };
    try {
      const dislikedArticle = await this.prisma.article.update({
        where: { id: articleId },
        data: payload,
      });
      return dislikedArticle;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
