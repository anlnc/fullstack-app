import { ApiProperty } from "@nestjs/swagger";
import { ApiResponse } from "src/common/types";

export class UserEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  fullname: string;

  constructor({ id, email, username, fullname }: Record<string, string>) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.fullname = fullname;
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
