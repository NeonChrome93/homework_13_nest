import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post, Put,
    Query, UseGuards
} from "@nestjs/common";
import {BlogsQueryType} from "../models/blogs-models";
import {createPostType, PostsQueryType, PostType, UpdatePostType} from "../models/posts-models";
import {query} from "express";
import {getQueryPagination} from "../utils/pagination";
import {PostsQueryRepository} from "./post.query.repository";
import {BlogQueryRepository} from "../blogs/blog.query.repository";
import {BlogService} from "../blogs/blog.service";
import {BlogRepository} from "../blogs/blog.repository";
import {PostService} from "./post.service";
import {PostRepository} from "./post.repository";
import {authMiddleware} from "../guards/user-guard";
import {CommentsQueryRepository} from "../comments/comment.query.repository";
import {updateLikeDto} from "../models/comments-models";
import {User} from "../users/user.entity";
import {CommentService} from "../comments/comment.service";
import {UserAll, UserId} from "../common/decorators/get-user.decorator";


@Controller('posts')
export class PostController {
    constructor(private readonly postsQueryRepository: PostsQueryRepository,
                private readonly postService: PostService,
                private readonly commentService: CommentService,
                private readonly postRepository: PostRepository,
                private readonly commentQueryRepository: CommentsQueryRepository) {
    }

    @Get()
    async getPosts(@Query() queryDto: PostsQueryType) {
        const userId = null
        const pagination = getQueryPagination(queryDto);
        const arr = await this.postsQueryRepository.readPosts(pagination, userId);
        return arr
    }

    @Get(':id')
    async getPostById(@Param('id') postId: string) {
        const userId = null
        let foundId = await this.postsQueryRepository.readPostId(postId, userId);
        if (foundId) {
            return foundId
        } else throw new NotFoundException('Post with this id not found')
    }

    @Post()
    @HttpCode(201)

    async createPosts(@Body() postDto :  createPostType) {
        const newPost = await this.postService.createPost(postDto);
        return newPost
        // @Put()
        // @HttpCode(201)
        // async updateLikeStatus(@Param('id') postId: string, ??@Body() postDto : PostType ) {
        //     const user = null
        //     const post = await this.postRepository.readPostId(postId)
        //     if(!post) throw new NotFoundException('Post with this id not found')
        //     const status = req.body.likeStatus
        //     let addLikes = await postService.addLikesByPost(postId, user._id.toString(), status)
        //     if(!addLikes) {
        //         return res.sendStatus(404)
        //     }
        //     return res.sendStatus(204)
        // }
    }
    @Put(':id')
    @HttpCode(204)
    async updatePost(@Param('id') postId: string,
                     @Body() postDto:  UpdatePostType) {

        let postUpdate = await this.postService.updatePosts(postId,postDto );
        if (postUpdate) {
            return postUpdate
        } else throw new NotFoundException('Post with this id not found')
    }

    @Delete(':id')
    @HttpCode(204)
    async deletePost(@Param('id') postId: string) {

        const isDeleted = await this.postService.deletePosts(postId);
        if (isDeleted) {
            return isDeleted
        } else throw new NotFoundException('Blog with this id not found');
    }

    @Get(':postId/comments')
    @UseGuards(authMiddleware)
    async getCommentByPostId(@Query() queryDto: PostsQueryType, @Param('id') postId: string, @UserId() userId: string | null) {
        //const userId = req.userId
        const pagination = getQueryPagination(queryDto);
        const post = await this.postRepository.readPostId(postId);
        if (!post) {
            throw new NotFoundException();
        }
        const comment = await this.commentQueryRepository.readCommentByPostId(postId, pagination, userId);
        if (!comment) throw new NotFoundException();
        else return comment;
    }

    @Post(':postId/comments')
    async createCommentByPostId(@Param('id') postId: string,@Body() dto: updateLikeDto,@UserAll() user: User) {
        const post = await this.postRepository.readPostId(postId);
        if (!post) throw new NotFoundException();

        const userId = user!._id.toString();
        const userLogin =user!.login;
        const newComment = await this.commentService.createComment(post._id.toString(), userId, userLogin, dto.status);
        return newComment;
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