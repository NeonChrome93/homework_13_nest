import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import request from "supertest";
import {PostViewType} from "../src/features/posts/api/models/output/post-output.model";


let postId = ''
let commentId = ""
let post: PostViewType;

const createBlog = {
    name: "Yaroslaw",
    description: "blabla",
    websiteUrl: "https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list"
}

const createPost = {

    title: "Cook",
    shortDescription: "Kitchen",
    content: "Reciepe",
    blogId: ""

}

const updatePost = {
    title: "Sport",
    shortDescription: "Gum",
    content: "Every day"

}


const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5"
}

xdescribe('Post API', () => {
    let app: INestApplication;


    beforeEach(async () => {
        console.log('ENV in TESTS', process.env.ENV)
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });


    it('Before all', async () => {
        await request(app.getHttpServer()).delete('/testing/all-data').expect(204)

    })

    it('Get all posts', async () => {
        await request(app.getHttpServer()).get('/posts').expect(200, {pagesCount: 1, page: 1, pageSize: 10, totalCount: 0, items: []})
    })


    it('Create Blog', async () => {
        const res = await request(app.getHttpServer()).post('/blogs').set(headers).send(createBlog).expect(201)
        //console.log(res.body)
        createPost.blogId = res.body.id
    })

    it('Create Post', async () => {
        const res = await request(app.getHttpServer()).post('/posts').set(headers).send(createPost).expect(201)
        postId = res.body.id;
        post = res.body
    })


    it('Should create post with blogId', async () => {
        const blog = await request(app.getHttpServer()).post('/blogs').set(headers).send(createBlog).expect(201)
        let post = await request(app.getHttpServer()).post(`/blogs/${blog.body.id}/posts`).set(headers).send({...createPost})
        await request(app.getHttpServer()).get(`/posts/${post.body.id}`).expect(200)


    })

    it('Update post', async () => {
        let post = await request(app.getHttpServer()).post('/posts').set(headers).send({...createPost}).expect(201)
        let updatedPost =await request(app.getHttpServer()).put(`/posts/${post.body.id}`).set(headers).send(updatePost).expect(204)
    })


    it('Delete post with id', async () => {
        const blog = await request(app.getHttpServer()).post('/blogs').set(headers).send(createBlog).expect(201)
        let post = await request(app.getHttpServer()).post(`/blogs/${blog.body.id}/posts`).set(headers).send({...createPost})
        await request (app.getHttpServer()).delete(`/posts/${post.body.id}`).set(headers).expect(204)
        await request(app.getHttpServer()).get(`/posts/${post.body.id}`).expect(404)
    })

})