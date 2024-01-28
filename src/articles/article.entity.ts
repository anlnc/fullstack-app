import { ApiProperty } from "@nestjs/swagger";
import { ApiResponse } from "src/common/types";

export class ArticleEntity {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  body: string;

  @ApiProperty({ type: Number })
  favorite_count: number;

  constructor({
    title,
    body,
    favoriteCount,
  }: {
    title: string;
    body: string;
    favoriteCount: number;
  }) {
    this.title = title;
    this.body = body;
    this.favorite_count = favoriteCount;
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
