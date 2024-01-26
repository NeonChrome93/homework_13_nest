import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import request from "supertest";
import {createNewUserModel, createUser} from "../utils/utils";
import {exec} from "child_process";
import {appSettings} from "../../src/config/app.settings";


describe('Users API', () => {
    let app: INestApplication;



    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        appSettings(app)
        await app.init();
    });

    it('Check user refreshToken to be invalid if it was refreshed before', async () => {


        const model = createNewUserModel();
        const res = await createUser(app, model);

        expect(res).toEqual({

            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String)

        })


        const res2 = await request(app.getHttpServer()).post('/auth/login').set(
            'User-Agent', 'Chrome'
        ).send({
            loginOrEmail: model.login,
            password: model.password
        })

        expect(res2.body).toEqual({
           accessToken: expect.any(String)
        })

        const refreshToken = res2.headers['set-cookie']
        console.log('rt in test', refreshToken)

        const res3 =  await request(app.getHttpServer()).post('/auth/refresh-token').set("Cookie", refreshToken).expect(200)

        expect(res3.body).toEqual({
            accessToken: expect.any(String)
        })



        // 1 - создать пользователя
        // 2 - залогиниться - получить рефреш токен (сделать утилитную функциб для кук) и запомнить
        // 3 - виполнить refresh-token
        //Set Timeout
    })

        // создать два девайса выйти с одного из них и потом попробовать удалить девайс с котрого я вышел
    //создать двух - трех юзеров, нужно залогиниться затем GET на девайсы достаю девайсы достаю их id а
    // затем прикрепляю пользователю сессию и потом проверяю что логауте конкретного пользолвателя удаляется именно его сессия



})
