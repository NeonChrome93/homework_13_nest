import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import {appSettings} from "../dist/config/app.settings";



const createBlog = {
  name: "Yaroslaw",
  description: "blabla",
  websiteUrl: "https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list"
}

const updateBlog = {
  name: "Blalla",
  description: "Blalal",
  websiteUrl: "https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list"
}

// const updatedBlog = {
//
//   name: 'Blalla',
//   description: 'Blalal',
//   websiteUrl: 'https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list',
//
// }



const headers = {
  "Authorization": "Basic YWRtaW46cXdlcnR5"
}

describe('BlogAPI (e2e)', () => {
  let app: INestApplication;
  let server

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app)
    await app.init();
    server = app.getHttpServer()

  });

  it('deleteAll', async ()=> {
    await request(server).delete('/testing/all-data').expect(204)
  })
  //app.getHttpServer() использовать вместо app

  it('get empty array of all blogs', async () => {
    const blogs = await request(app.getHttpServer()).get('/blogs').expect(200)

    expect(blogs.body).toEqual({
      totalCount: 0,
      page:1,
      pageSize:10,
      pagesCount: 1,
      items: expect.any(Array)
    })

    expect(blogs.body.items.length).toBe(0)
  })

  it('Get blog ID', async () => {
    const blogs = await request(app.getHttpServer()).post('/blogs').set(headers).send(createBlog)
    await request(app.getHttpServer()).get(`/blogs/${blogs.body.id}`).expect(200, blogs.body)

  })

  it('Create and Put blog', async () => {
    const blogs = await request(app.getHttpServer()).post('/blogs').set(headers).send(createBlog).expect(201)
    const blogUpdate = await request(app.getHttpServer()).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204 )
    expect(blogUpdate.body).toEqual({})


  })

  it('Delete blog ID', async () => {
    const blogs = await request(app.getHttpServer()).post('/blogs').set(headers).send(createBlog).expect(201)
    await request(app.getHttpServer()).delete(`/blogs/${blogs.body.id}`).set(headers).expect(204)
  })

  // it('Put blog without aut', async () => {
  //   const blogs = await request(app.getHttpServer()).post('/blogs').send(createBlog).expect(401)
  //   //await request(app).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(401)
  // })
});
