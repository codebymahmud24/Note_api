import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  });
  // validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true}));
  // cookies
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
