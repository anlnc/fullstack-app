import { ApiProperty } from "@nestjs/swagger";
import { ApiResponse } from "src/common/types";

export class ArticleEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  body: string;

  @ApiProperty({ type: Number })
  favorite_count: number;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  updated_at: Date;

  constructor({
    id,
    title,
    body,
    favoriteCount,
    createdAt,
    updatedAt,
  }: {
    id: string;
    title: string;
    body: string;
    favoriteCount: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.favorite_count = favoriteCount;
    this.created_at = createdAt;
    this.updated_at = updatedAt;
  }
}

export class ArticleResponse extends ApiResponse {
  @ApiProperty({ type: ArticleEntity })
  data: ArticleEntity;
}

export class ArticleListResponse extends ApiResponse {
  @ApiProperty({ type: [ArticleEntity] })
  data: ArticleEntity[];
}
