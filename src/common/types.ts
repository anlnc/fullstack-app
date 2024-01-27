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

export class DatabaseAccessError extends Error {
  constructor(message: string = "Database access error") {
    super(message);
  }
}

export class MissingRequiredArgumentError extends Error {
  constructor(message: string = "Missing required argument") {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not Found") {
    super(message);
  }
}

export class ConflictError extends Error {
  constructor(message: string = "Conflict") {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "Invalid credentials") {
    super(message);
  }
}
