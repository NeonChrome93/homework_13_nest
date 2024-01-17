import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {appSettings} from "./config/app.settings";

// do this somewhere in the global application level:

//let validator = Container.get(Validator);


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSettings(app)
  await app.listen(5000);
}
 bootstrap();
