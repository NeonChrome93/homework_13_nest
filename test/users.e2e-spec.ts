import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import request from "supertest";
import {EmailAdapter} from "../src/features/auth/adapters/email.adapter";

const createUser = {

    login: "Date",
    email: "y.smirnow@yandex.ru",
    password: "123456"
}

const createUser2 = {
    login: "Trasher",
    email: "y.trhash@yandexx.ru",
    password: "1234562"
}


const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5"
}

xdescribe('Users API', () => {
    let app: INestApplication;



    beforeEach(async () => {
        console.log('ENV in TESTS', process.env.ENV)
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()
            // .overrideProvider(EmailAdapter)
            // .useClass(EmailAdapterMock)
            // .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });


    it('Before all', async () => {
        await request(app.getHttpServer()).delete('/testing/all-data').expect(204)

    })

    it('Get all users', async () => {
        await request(app.getHttpServer()).get('/users').set(headers).expect(200, {pagesCount: 1, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('Create User', async () => {
        await request(app.getHttpServer()).post('/users').set(headers).send(createUser).expect(201)
    });

    it('Get User', async () => {
        await request(app.getHttpServer()).get('/users').set(headers).expect(200)
    });

    it('Delete User ', async () => {
        let user = await request(app.getHttpServer()).post('/users').set(headers).send(createUser2)
        await request(app.getHttpServer()).delete(`/users/${user.body.id}`).set(headers).expect(204)
    });
})
