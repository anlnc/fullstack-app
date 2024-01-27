import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { FastifyReply } from "fastify";
import {
  ConflictError,
  DatabaseAccessError,
  MissingRequiredArgumentError,
  NotFoundError,
  UnauthorizedError,
} from "./common/types";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    switch (true) {
      case error instanceof MissingRequiredArgumentError:
        return reply.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        });

      case error instanceof NotFoundError: {
        return reply.status(HttpStatus.NOT_FOUND).send({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }

      case error instanceof DatabaseAccessError: {
        return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      }

      case error instanceof ConflictError: {
        return reply.status(HttpStatus.CONFLICT).send({
          statusCode: HttpStatus.CONFLICT,
          message: error.message,
        });
      }

      case error instanceof UnauthorizedError: {
        return reply.status(HttpStatus.UNAUTHORIZED).send({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: error.message,
        });
      }

      default:
        const status = error["status"] ?? HttpStatus.INTERNAL_SERVER_ERROR;
        return reply.status(status).send({
          statusCode: status,
          message: error.message ?? "Internal Server Error",
        });
    }
  }
}
