import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ApiResponse {
  @ApiProperty({ description: "HTTP status code" })
  statusCode: number;
  @ApiProperty()
  data?: unknown;
  total?: number | null;

  constructor(statusCode: HttpStatus, data: unknown, total?: number | null) {
    this.statusCode = statusCode;
    this.data = data;
    this.total = total; // for pagination
  }
}
