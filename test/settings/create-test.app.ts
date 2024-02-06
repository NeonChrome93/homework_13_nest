import {Test, TestingModule} from "@nestjs/testing";
import {MongooseModule} from "@nestjs/mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";
import {AppModule} from "../../src/app.module";
import {appSettings} from "../../src/config/app.settings";
import {INestApplication} from "@nestjs/common";

let testingServer;
let app: INestApplication;

export const createTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            MongooseModule.forRootAsync({
                useFactory: async () => {
                    testingServer = await MongoMemoryServer.create();
                    const uri = testingServer.getUri();

                    return {
                        uri: uri,
                    };
                },
            }as any),
            AppModule,
        ],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app)
    await app.init();

    return app
}