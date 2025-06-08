import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { LoggingMiddleware } from "./logging.middleware";
import * as dotenv from "dotenv";

dotenv.config();
const APP_PORT = process.env.APP_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(new LoggingMiddleware().use);

  app.enableCors({
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("CrossLink API")
    .setDescription("API documentation for CrossLink")
    .setVersion("1.0")
    .addTag("auth")
    .addTag("users")
    .addTag("transactions")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(APP_PORT);
  console.log(`Application is running on http://localhost:${APP_PORT} 🚀`);
}
bootstrap();
