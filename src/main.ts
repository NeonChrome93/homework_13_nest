import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {HttpExceptionFilter} from "./common/exception-filter";
import {BadRequestException, ValidationError, ValidationPipe} from "@nestjs/common";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, //transformation of types
            stopAtFirstError: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const errorsForResponse: any = [];
                errors.forEach((e) => {
                    const constraintsKeys = Object.keys(e.constraints!);
                    constraintsKeys.forEach((ckey) => {
                        errorsForResponse.push({
                            message: e.constraints![ckey],
                            field: e.property,
                        });
                    });
                });

                throw new BadRequestException(errorsForResponse);
            },
        }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors()
  await app.listen(5000);
}
 bootstrap();
