import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export default (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("OpenAPI")
    .addBearerAuth({ type: "http", scheme: "Bearer", bearerFormat: "JWT" }, "access-token")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config, {});

  // Remove a global security requirement for public routes
  Object.values(document.paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (Array.isArray(method.security) && method.security.includes("public")) {
        method.security = [];
      }
    });
  });

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
