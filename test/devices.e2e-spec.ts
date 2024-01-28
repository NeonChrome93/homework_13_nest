import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import {appSettings} from "../src/config/app.settings";
import {createNewUserModel, createUser, unpackingToken, wait} from "./utils/utils";
import request from "supertest";
import {UsersRepository} from "../src/features/users/repositories/user.repository";
import {DevicesRepository} from "../src/features/devices/repositories/device.repository";
import {JwtAdapter} from "../src/features/auth/adapters/jwt.adapter";
import {log} from "util";
import {Device} from "../src/features/devices/domain/device.entity";
import any = jasmine.any;

let deviceGlobal: Device | null = null


describe('Create device, delete device by id, delete all devices except the current one', () => {
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

    it('Login in app, make sure that device created', async () => {


        const model = createNewUserModel();
        const user = await createUser(app, model);

        expect(user).toEqual({

            id: expect.any(String),
            login: model.login,
            email: model.email,
            createdAt: expect.any(String)

        })

        process.env.REFRESH_TIME = '1m'
        const login = await request(app.getHttpServer()).post('/auth/login').set(
            'User-Agent', 'Chrome'
        ).send({
            loginOrEmail: model.login,
            password: model.password
        })

        // expect(login.body).toEqual({
        //     refreshToken: expect.any(String)
        // })



        const refreshTokenArr = unpackingToken(login)

        console.log('refreshTokenSubstr', refreshTokenArr)
        let payload = await jwtAdapter.getPayloadByToken(refreshTokenArr)

        console.log('deviceId', payload.deviceId)

        let device = await devicesRepository.findDevice(payload.deviceId)
        deviceGlobal =device

        expect(device.title).toBe('Chrome')


    })

    it('Get devices', async () => {
        await request(app.getHttpServer()).get('security/devices').expect(200)
    })

})