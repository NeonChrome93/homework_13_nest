import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import request from "supertest";

const createUser = {
    login: "Yaros",
    email: "y.snegirov@yandex.ru",
    password: "123456"
}


const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5"
}

describe('Users API', () => {
    let app: INestApplication;


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });


    it('Before all', async () => {
        await request(app.getHttpServer()).delete('/testing/all-data').expect(204)

    })

    it('Get all users', async () => {
        await request(app.getHttpServer()).get('/users').expect(200, {pagesCount: 1, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('Create User', async () => {
        await request(app.getHttpServer()).post('/users').set(headers).send(createUser).expect(201)
    });

    it('Get User', async () => {
        await request(app.getHttpServer()).get('/users').expect(200)
    });

    it('Delete User ', async () => {
        let user = await request(app.getHttpServer()).post('/users').set(headers).send(createUser).expect(201)
        await request(app.getHttpServer()).delete(`/users/${user.body.id}`).set(headers).expect(204)
    });
})
