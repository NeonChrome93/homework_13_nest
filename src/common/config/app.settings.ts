import {BadRequestException, INestApplication, ValidationError, ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "../../infrastructure/exception-filters/exception-filter";
import {useContainer} from "class-validator";
import {AppModule} from "../../app.module";
import cookieParser from "cookie-parser";

export const appSettings = (app: INestApplication) => {
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
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.enableCors()
    app.use(cookieParser())

}