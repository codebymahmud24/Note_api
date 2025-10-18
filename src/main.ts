import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {  ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  });
  // validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // use global exception filters
  app.useGlobalFilters(new AllExceptionsFilter());
  // cookies
  app.use(cookieParser());

  // Swagger setup 
  const config = new DocumentBuilder()
    .setTitle('Notes API') // project name
    .setDescription('API documentation for Notes App') // short description
    .setVersion('1.0')
    .addBearerAuth() // if you use JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // <-- localhost:3000/api/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
