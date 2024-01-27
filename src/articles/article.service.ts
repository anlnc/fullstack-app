import { Injectable } from "@nestjs/common";
import { Article } from "@prisma/client";
import { DatabaseAccessError, MissingRequiredArgumentError, NotFoundError } from "src/common/types";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  // @TODO: handle pagination
  async listArticles(): Promise<Article[]> {
    try {
      const articles = await this.prisma.article.findMany({ orderBy: { createdAt: "desc" } });
      return articles;
    } catch (error) {
      throw new DatabaseAccessError();
    }
  }

  async findOne(articleId: number): Promise<Article> {
    if (!articleId) {
      throw new MissingRequiredArgumentError("Article id is required");
    }
    try {
      const article = await this.prisma.article.findUnique({ where: { id: articleId } });
      return article;
    } catch (error) {
      throw new DatabaseAccessError();
    }
  }

  async create(
    { title, body }: { title: string; body: string },
    authorId: number
  ): Promise<Article> {
    if (!title || !body || !authorId) {
      throw new MissingRequiredArgumentError();
    }
    try {
      const payload = { title, body, authorId };
      const createdArticle = await this.prisma.article.create({
        data: payload,
      });
      return createdArticle;
    } catch (error) {
      throw new DatabaseAccessError();
    }
  }

  async update(
    { title, body }: { title: string; body: string },
    articleId: number
  ): Promise<Article> {
    if (!title || !body || !articleId) {
      throw new MissingRequiredArgumentError();
    }
    try {
      const article = await this.findOne(articleId);
      if (!article) {
        throw new NotFoundError(`Article with id ${articleId} not found`);
      }
      const payload = { title, body, updatedAt: new Date() };
      const updatedArticle = await this.prisma.article.update({
        where: { id: articleId },
        data: payload,
      });
      return updatedArticle;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseAccessError();
    }
  }

  async delete(articleId: number): Promise<void> {
    if (!articleId) {
      throw new MissingRequiredArgumentError("Article id is required");
    }
    try {
      const articleToDelete = await this.findOne(articleId);
      if (!articleToDelete) {
        throw new NotFoundError(`Article with id ${articleId} not found`);
      }
      await this.prisma.article.delete({
        where: { id: articleId },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseAccessError();
    }
  }

  async favorite(articleId: number): Promise<Article> {
    if (!articleId) {
      throw new MissingRequiredArgumentError("Article id is required");
    }
    try {
      const articleToFavorite = await this.findOne(articleId);
      if (!articleToFavorite) {
        throw new NotFoundError(`Article with id ${articleId} not found`);
      }
      const updatedArticle = await this.prisma.article.update({
        where: { id: articleId },
        data: {
          favoriteCount: {
            increment: 1,
          },
          updatedAt: {
            set: new Date(),
          },
        },
      });
      return updatedArticle;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseAccessError();
    }
  }

  async unfavorite(articleId: number): Promise<Article> {
    if (!articleId) {
      throw new MissingRequiredArgumentError("Article id is required");
    }
    try {
      const articleToUnfavorite = await this.findOne(articleId);
      if (!articleToUnfavorite) {
        throw new NotFoundError(`Article with id ${articleId} not found`);
      }
      const updatedArticle = await this.prisma.article.update({
        where: { id: articleId },
        data: {
          favoriteCount: {
            decrement: 1,
          },
          updatedAt: {
            set: new Date(),
          },
        },
      });
      return updatedArticle;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseAccessError();
    }
  }
}
