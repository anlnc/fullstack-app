import fastifyCookie from "@fastify/cookie";
import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyInstance, fastify } from "fastify";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./http-exception.filter";
import setupSwagger from "./setup-swagger";

const GLOBAL_PREFIX = "api";
async function bootstrap() {
  const instance: FastifyInstance = fastify().get("/", (_, reply) => {
    reply.redirect("/docs");
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance)
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.register(fastifyCookie);
  app.setGlobalPrefix(GLOBAL_PREFIX, { exclude: [{ path: "", method: RequestMethod.GET }] });
  setupSwagger(app);
  app.enableCors();
  console.info("LISTENING ON PORT 3000");
  await app.listen(3000, "0.0.0.0");
}
bootstrap();
