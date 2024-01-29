import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import dayjs from "dayjs";
import { Observable } from "rxjs";
import winston from "winston";

const ALLOW_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

// Set up winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: `logs/${dayjs().format("YYYY-MM-DD")}/requests.txt` }),
  ],
});

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest();
    const shouldLogRequest = ALLOW_METHODS.includes(request.method);
    if (shouldLogRequest) {
      const requestLog = {
        time: new Date(),
        method: request.method,
        url: request.url,
        params: request.params,
      };
      console.info(JSON.stringify(requestLog));
      logger.info("Request", requestLog);
    }
    return next.handle();
  }
}
