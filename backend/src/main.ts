import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { LoggingMiddleware } from "./logging.middleware";

const APP_PORT = 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(new LoggingMiddleware().use);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: "http://localhost:3000", // frontend URL
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

  await app.listen(process.env.APP_PORT || APP_PORT);
  console.log("Application is running on http://localhost:3001 🚀");
}
bootstrap();
