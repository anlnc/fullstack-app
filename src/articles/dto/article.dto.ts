import { IsString, IsNotEmpty } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly body: string;
}

export class UpdateArticleDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly body: string;
}
