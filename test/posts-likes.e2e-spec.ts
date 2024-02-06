
import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import request from "supertest";
import {appSettings} from "../src/config/app.settings";
import {PostViewType} from "../src/features/posts/api/models/output/post-output.model";
import {UserViewModel} from "../src/features/users/api/models/output/user.output.model";


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

export type PaginationModels<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T
}

let postId = ''
let commentId = ""
let post: PostViewType;
let user1: UserViewModel;
let user2: UserViewModel;
let user3: UserViewModel;

const createUser1 = {
    login: "Meine",
    email: "y.snegirov@yandex.ru",
    password: "12345678"
}

const createUser2 = {
    login: "Ivan",
    email: "ivan@yandex.ru",
    password: "12345678"
}

const createUser3 = {
    login: "Gleb",
    email: "gleb@yandex.ru",
    password: "12345678"
}

const createUser4 = {
    login: "Daniel",
    email: "dane@yandex.ru",
    password: "12345678"
}

let createComment = {
    content: "Hello Samurai how are you"
}


const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5",
    "user-agent": "Mozilla"

}
let token1 = "";

let token2 = "";

let token3 = "";

let token4 = "";

xdescribe('Likes Posts', () => {
    let app: INestApplication;


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],

        }).compile();

        app = moduleFixture.createNestApplication();
        appSettings(app)
        await app.init();
        //server = app.getHttpServer()

    });

    it('deleteAll', async () => {
        await request(app.getHttpServer()).delete('/testing/all-data').expect(204)
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

    it('CreateUser', async () => {
        user1 = (await request(app.getHttpServer()).post('/users').set(headers).send(createUser1).expect(201)).body


        user2 = (await request(app.getHttpServer()).post('/users').set(headers).send(createUser2).expect(201)).body
         user3 = (await request(app.getHttpServer()).post('/users').set(headers).send(createUser3).expect(201)).body
        const user4 = await request(app.getHttpServer()).post('/users').set(headers).send(createUser4).expect(201)
        // console.log(user1.body)
    })

    it('Login', async () => {
        const res1 = await request(app.getHttpServer()).post('/auth/login').send({
            loginOrEmail: createUser1.login,
            password: createUser1.password
        }).expect(200)
        token1 = res1.body.accessToken
        const res2 = await request(app.getHttpServer()).post('/auth/login').send({
            loginOrEmail: createUser2.login,
            password: createUser2.password
        }).expect(200)
        token2 = res2.body.accessToken
        const res3 = await request(app.getHttpServer()).post('/auth/login').send({
            loginOrEmail: createUser3.login,
            password: createUser3.password
        }).expect(200)
        token3 = res3.body.accessToken
        const res4 = await request(app.getHttpServer()).post('/auth/login').send({
            loginOrEmail: createUser4.login,
            password: createUser4.password
        }).expect(200)
        token4 = res4.body.accessToken
        console.log(token1)
    })

    it('Likes Posts ', async () => {
        let likesPostUser1 = await request(app.getHttpServer()).put(`/posts/${postId}/like-status`).set({authorization: "Bearer " + token1})
            .send({likeStatus: "Like"}).expect(204)

        let res = await request(app.getHttpServer()).get(`/posts/${postId}`).set({authorization: "Bearer " + token1}).expect(200)
        expect(res.body).toEqual({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: 'Like',
                newestLikes: expect.any(Array)
            }
        })

        expect(res.body.extendedLikesInfo.newestLikes.length).toBe(1)

        await request(app.getHttpServer()).put(`/posts/${postId}/like-status`).set({authorization: "Bearer " + token2})
            .send({likeStatus: "Like"}).expect(204)

        let res2 = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200)
        console.log('RESPONSE2:', res2.body)

        expect(res2.body).toEqual({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 2,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: expect.any(Array)
            }
        })

        expect(res2.body.extendedLikesInfo.newestLikes.length).toBe(2)

        let likesPostUser3 = await request(app.getHttpServer()).put(`/posts/${postId}/like-status`).set({authorization: "Bearer " + token3})
            .send({likeStatus: "Dislike"}).expect(204)

        let res3 = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200)

        expect(res3.body).toEqual({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 2,
                dislikesCount: 1,
                myStatus: 'None',
                newestLikes: expect.any(Array)
            }
        })

        expect(res3.body.extendedLikesInfo.newestLikes.length).toBe(2)

        await request(app.getHttpServer()).put(`/posts/${postId}/like-status`).set({authorization: "Bearer " + token4})
            .send({likeStatus: "Like"}).expect(204)

        let res4 = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200)

        expect(res4.body).toEqual({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 3,
                dislikesCount: 1,
                myStatus: 'None',
                newestLikes: expect.any(Array)
            }
        })

        expect(res4.body.extendedLikesInfo.newestLikes.length).toBe(3)

        await request(app.getHttpServer()).put(`/posts/${postId}/like-status`).set({authorization: "Bearer " + token4})
            .send({likeStatus: "Dislike"}).expect(204)

        let res5 = await request(app.getHttpServer()).get(`/posts/${postId}`).set({authorization: "Bearer " + token2}).expect(200)

        expect(res5.body).toEqual({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 2,
                dislikesCount: 2,
                myStatus: "Like",
                newestLikes: expect.any(Array)
            }
        })

        expect(res5.body.extendedLikesInfo.newestLikes.length).toBe(2)

        await request(app.getHttpServer()).put(`/posts/${postId}/like-status`).set({authorization: "Bearer " + token3})
            .send({likeStatus: "Like"}).expect(204)

        let res6 = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200)

        expect(res6.body).toEqual({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 3,
                dislikesCount: 1,
                myStatus: 'None',
                newestLikes: expect.any(Array)
            }
        })

        expect(res6.body.extendedLikesInfo.newestLikes.length).toBe(3)

    });

    it('All Posts For Specific Blog ', async () => {
        let allPostsForSpBlog = await request(app.getHttpServer()).get(`/blogs/${createPost.blogId}/posts`).set({authorization: "Bearer " + token3}).expect(200)

        expect(allPostsForSpBlog.body.items[0]).toEqual({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 3,
                dislikesCount: 1,
                myStatus: 'Like',
                newestLikes: [
                    {
                        addedAt: expect.any(String),
                        userId: user3.id,
                        login: user3.login,
                    },
                    {
                        addedAt: expect.any(String),
                        userId: user2.id,
                        login: user2.login,
                    },
                    {
                        addedAt: expect.any(String),
                        userId: user1.id,
                        login: user1.login,
                    },
                ]
            }
        })

        // expect(allPostsForSpBlog.body).toEqual(
        //     {
        //         pagesCount: expect.any(Number),
        //         page:  expect.any(Number),
        //         pageSize:  expect.any(Number),
        //         totalCount:  expect.any(Number),
        //         items:
        //             [{
        //                 id: post.id,
        //                 title: post.title,
        //                 shortDescription: post.shortDescription,
        //                 content: post.content,
        //                 blogId: post.blogId,
        //                 blogName: post.blogName,
        //                 createdAt: post.createdAt,
        //                 extendedLikesInfo: {
        //                     likesCount: 3,
        //                     dislikesCount: 1,
        //                     myStatus: 'Like',
        //                     newestLikes:  [
        //                         {
        //                             addedAt:  expect.any(String),
        //                             userId : user2.id,
        //                             login: user2.login,
        //                         },
        //                         {
        //                             addedAt:  expect.any(String),
        //                             userId : user1.id,
        //                             login: user1.login,
        //                         },
        //                     ]
        //
        //                 }
        //
        //
        //             }]
        //     }
        // )


    })
})