import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from "models/app/app.module";
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      skipUndefinedProperties: true,
    }),
  );
  app.enableCors({ credentials: true, origin: true });
  await app.listen(3000);
}
bootstrap();
