import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import {appSettings} from "../src/config/app.settings";
import {createNewUserModel, createUser, unpackingToken, wait} from "./utils/utils";
import request from "supertest";
import {UsersRepository} from "../src/features/users/repositories/user.repository";
import {DevicesRepository} from "../src/features/devices/repositories/device.repository";
import {JwtAdapter} from "../src/features/auth/adapters/jwt.adapter";
import {Device} from "../src/features/devices/domain/device.entity";



let deviceGlobal: Device | null = null
let token = '';


xdescribe('Create device, delete device by id, delete all devices except the current one', () => {
    let app: INestApplication;
    let devicesRepository;
    let jwtAdapter;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        appSettings(app)

        devicesRepository= moduleFixture.get<DevicesRepository>(DevicesRepository)
        jwtAdapter = moduleFixture.get<JwtAdapter>(JwtAdapter)
        await app.init();
    });

    it('deleteAll', async ()=> {
        await request(app.getHttpServer()).delete('/testing/all-data').expect(204)
    })

    it('Login in app, make sure that device created', async () => {


        const model = createNewUserModel();
        const user = await createUser(app, model);

        expect(user).toEqual({

            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String)

        })

        //process.env.REFRESH_TIME = '1m'
        const login = await request(app.getHttpServer()).post('/auth/login').set(
            'User-Agent', 'Chrome'
        ).send({
            loginOrEmail: model.login,
            password: model.password
        })

        // expect(login.body).toEqual({
        //     refreshToken: expect.any(String)
        // })

        const refreshToken = login.headers['set-cookie']
        token = refreshToken

        const refreshTokenArr = unpackingToken(login)
        let payload = await jwtAdapter.getPayloadByToken(refreshTokenArr)

        console.log('deviceId', payload.deviceId)

        let device = await devicesRepository.findDevice(payload.deviceId)
        deviceGlobal =device

        expect(device.title).toBe('Chrome')


    })

   xit('Get devices', async () => {
       const res1 = await request(app.getHttpServer()).post('/auth/refresh-token').set("Cookie", token).expect(200)
        //console.log('accessToken', accessToken.body.accessToken)//новые куки

        let response = await request(app.getHttpServer()).get('/security/devices').set("Cookie", token).expect(200)
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({title: 'Chrome'})
        ]))
    })

    xit('Delete Device by id', async () => {
        await request(app.getHttpServer()).delete(`/security/devices/${deviceGlobal?.deviceId}`).set("Cookie", token).expect(204)
    });

    it('Delete Device 403 incorrect', async () => {
        const model = createNewUserModel();
        const user = await createUser(app, model);

        expect(user).toEqual({

            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String)

        })

        const model2 = createNewUserModel();
        const user2 = await createUser(app, model2);

        expect(user2).toEqual({

            id: expect.any(String),
            login: model2.login,
            email: model2.email,
            createdAt: expect.any(String)

        })

        const loginUser1 = await request(app.getHttpServer()).post('/auth/login').set(
            'User-Agent', 'Edge'
        ).send({
            loginOrEmail: model.login,
            password: model.password
        })
        console.log('loginUser',loginUser1)
        const loginUser2 = await request(app.getHttpServer()).post('/auth/login').set(
            'User-Agent', 'Mozilla'
        ).send({
            loginOrEmail: model2.login,
            password: model2.password
        })
        console.log('loginUser2',loginUser2)

        //const refreshUser1 = loginUser1.headers['set-cookie']
        const refreshUser2 = loginUser2.headers['set-cookie']

        const refreshTokenUser1 = unpackingToken(loginUser1)
        let payloadTokenUser1 = await jwtAdapter.getPayloadByToken(refreshTokenUser1)



        await request(app.getHttpServer()).delete(`/security/devices/${payloadTokenUser1?.deviceId}`).set("Cookie",  refreshUser2).expect(403)
    });

    it('Delete all devices except current  ', async () =>{
        const model = createNewUserModel();
        const user = await createUser(app, model);

        expect(user).toEqual({

            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String)

        })

        process.env.REFRESH_TIME = '1m'
        const loginDevice1 = await request(app.getHttpServer()).post('/auth/login').set(
            'User-Agent', 'Edge'
        ).send({
            loginOrEmail: model.login,
            password: model.password
        })

        const loginDevice2 = await request(app.getHttpServer()).post('/auth/login').set(
            'User-Agent', 'Mozilla'
        ).send({
            loginOrEmail: model.login,
            password: model.password
        })

        const refreshToken1 = loginDevice1.headers['set-cookie']
        const refreshToken2 = loginDevice2.headers['set-cookie']

        await request(app.getHttpServer()).delete('/security/devices').set("Cookie", refreshToken1).expect(204)
        let response = await request(app.getHttpServer()).get('/security/devices').set("Cookie", refreshToken1).expect(200)
        expect(response.body).toEqual(expect.arrayContaining([
            expect.not.objectContaining({title: 'Mozilla'})
        ]))

    });

})