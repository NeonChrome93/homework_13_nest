import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {HttpExceptionFilter} from "./common/exception-filter";
import {BadRequestException, ValidationError, ValidationPipe} from "@nestjs/common";
import { useContainer, Validator } from 'class-validator';
import {appSettings} from "./common/config/app.settings";

// do this somewhere in the global application level:

//let validator = Container.get(Validator);


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSettings(app)
  await app.listen(5000);
}
 bootstrap();
