import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";
import { AppModule } from "./app.module";
import { RequestMethod } from "@nestjs/common";

const GLOBAL_PREFIX = "api";
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await app.register(fastifyCookie);
  app.setGlobalPrefix(GLOBAL_PREFIX, { exclude: [{ path: "", method: RequestMethod.GET }] });
  await app.listen(3000);
}
bootstrap();
