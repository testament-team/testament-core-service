import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle("Testament Core Service")
    .setDescription("A REST API for core Testament functionalities")
    .setVersion(env.npm_package_version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/docs", app, document);

  await app.listen(env["PORT"] || 8081);
}
bootstrap();
