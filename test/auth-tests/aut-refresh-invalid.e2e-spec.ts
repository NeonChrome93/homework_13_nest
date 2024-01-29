import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import request from "supertest";
import {createNewUserModel, createUser, wait} from "../utils/utils";
import {exec} from "child_process";
import {appSettings} from "../../src/config/app.settings";


describe('Сheck user refreshToken to be invalid', () => {
    let app: INestApplication;



    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        appSettings(app)
        await app.init();
    });

    it('check user refreshToken to be invalid if it was refreshed before', async () => {


        const model = createNewUserModel();
        const res = await createUser(app, model);

        expect(res).toEqual({

            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String)

        })
        process.env.REFRESH_TIME = '2s'
        const res2 = await request(app.getHttpServer()).post('/auth/login').set(
            'Content-Type', 'application/json'
        ).send({
            loginOrEmail: model.login,
            password: model.password
        }).expect(200)
        //
         await wait(3)

        const res3 = await request(app.getHttpServer()).post('/auth/login').set(
            'Content-Type', 'application/json'
        ).send({
            loginOrEmail: model.login,
            password: model.password
        }).expect(200)



        const refreshToken = res2.headers['set-cookie'].ref
        const res4 = await request(app.getHttpServer()).post('/auth/refresh-token').set("Cookie", refreshToken).expect(401)

    })

})