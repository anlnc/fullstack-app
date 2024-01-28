import { ApiResponse } from "src/common/types";
import { ApiProperty } from "@nestjs/swagger";

export class TokenEntity {
  @ApiProperty({ type: String })
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

export class AuthResponse extends ApiResponse {
  @ApiProperty({ type: TokenEntity })
  data: TokenEntity;
}
