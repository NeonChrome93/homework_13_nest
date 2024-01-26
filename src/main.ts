import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {appSettings} from "./config/app.settings";

// do this somewhere in the global application level:

//let validator = Container.get(Validator);


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    console.log('main.ts ENV', process.env.ENV)
  appSettings(app)
  await app.listen(5000);
}
 bootstrap();
