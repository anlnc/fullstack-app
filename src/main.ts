import fastifyCookie from "@fastify/cookie";
import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./http-exception.filter";

const GLOBAL_PREFIX = "api";
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.register(fastifyCookie);
  app.setGlobalPrefix(GLOBAL_PREFIX, { exclude: [{ path: "", method: RequestMethod.GET }] });
  await app.listen(3000);
}
bootstrap();
