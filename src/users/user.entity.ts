import { ApiProperty } from "@nestjs/swagger";
import { ApiResponse } from "src/common/types";

export class UserEntity {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  username: string;

  constructor({ email, username }: Record<string, string>) {
    this.email = email;
    this.username = username;
  }
}

export class UserResponse extends ApiResponse {
  @ApiProperty({ type: UserEntity })
  data: UserEntity;
}

export class UserListResponse extends ApiResponse {
  @ApiProperty({ type: [UserEntity] })
  data: UserEntity[];
}
