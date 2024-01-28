import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({
    description: "Article title",
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: "Article body",
  })
  @IsString()
  @IsNotEmpty()
  readonly body: string;
}

export class UpdateArticleDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly body: string;
}
