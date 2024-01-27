import { IsString, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly fullname: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}


