import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post, Put,
    Query
} from "@nestjs/common";
import {BlogsQueryType} from "../models/blogs-models";
import {PostsQueryType, PostType} from "../models/posts-models";
import {query} from "express";
import {getQueryPagination} from "../utils/pagination";


@Controller('posts')
export class PostController {

    @Get()
    async getPosts(@Query() queryDto: PostsQueryType) {
        const userId = null
        const pagination = getQueryPagination(queryDto);
        const arr = await postsQueryRepository.readPosts(pagination, userId);
        return arr
    }

    @Get(':id')
    async getPostById(@Param('id') postId: string) {
        const userId = null
        let foundId = await postsQueryRepository.readPostId(postId, userId);
        if (foundId) {
            return foundId
        } else throw new NotFoundException('Post with this id not found')
    }

    @Post()
    @HttpCode(201)
    async createPosts(@Body() postDto : PostType) {
        const newPosts = await postService.createPost(postDto);
        if (!newPosts) throw new BadRequestException('Bad Request')
        else return newPosts
    }
    @Put()
    @HttpCode(201)
    async updateLikeStatus(@Param('id') postId: string) {
        const user = null
        const post = await postRepository.readPostId(postId)
        if(!post) return res.sendStatus(404)
        const status = req.body.likeStatus
        let addLikes = await postService.addLikesByPost(postId, user._id.toString(), status)
        if(!addLikes) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }

    @Put()
    @HttpCode(201)
    async updatePost(@Param('id') postId: string,@Body() postDto: PostType) {

        let postUpdate = await postService.updatePosts(postId,postDto );
        if (postUpdate) {
            res.sendStatus(204);
        } else res.sendStatus(404);
    }

    @Delete(':id')
    async deletePost(@Param('id') postId: string) {

        const isDeleted = await postService.deletePosts(postId);
        if (isDeleted) {
            res.sendStatus(204);
        } else res.sendStatus(404);
    }
    @Get(':postId/comments')
    async getCommentByPostId(@Query() queryDto: PostsQueryType, @Param('id') postId: string) {
        //const userId = req.userId
        const pagination = getQueryPagination(queryDto);
        const post = await postRepository.readPostId(postId);
        if (!post) {
            return res.sendStatus(404);
        }
        const comment = await commentsQueryRepository.readCommentByPostId(postId, pagination, userId);
        if (!comment) return res.sendStatus(404);
        return res.status(200).send(comment);
    }

    @Post(':postId/comments')
    async createCommentByPostId(@Param('id') postId: string) {
        const post = await postRepository.readPostId(postId);
        if (!post) return res.sendStatus(404);

        const userId = req.user!._id.toString();
        const userLogin = req.user!.login;
        const newComment = await commentService.createComment(post._id.toString(), userId, userLogin, req.body.content);
        return res.status(201).send(newComment);
    }

}

// const postControllerInstance = new PostController();
//
// postsRouter.get('/',  getUserMiddleware, postControllerInstance.getPosts)
//
// postsRouter.get('/:id',  getUserMiddleware, postControllerInstance.getPostById)
//
// postsRouter.post('/',
//     authGuardMiddleware,
//     ...validationCreateUpdatePost, postControllerInstance.createPosts)
//
// postsRouter.put('/:postId/like-status', authMiddleware, ...likesValidation, postControllerInstance.updateLikeStatus)
//
// postsRouter.put('/:id',
//     authGuardMiddleware,
//     ...validationCreateUpdatePost,postControllerInstance.updatePost)
//
// postsRouter.delete('/:id',
//     authGuardMiddleware,postControllerInstance.deletePost)
//
// postsRouter.get('/:postId/comments',getUserMiddleware, postControllerInstance.getCommentByPostId)
//
// postsRouter.post('/:postId/comments',
//     authMiddleware,
//     ...contentValidation, postControllerInstance.createCommentByPostId)