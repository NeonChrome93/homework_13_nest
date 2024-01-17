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
import {getQueryPagination} from "../../../utils/pagination";
import {PostsQueryRepository} from "../repositories/post.query.repository";
import {PostService} from "../application/post.service";
import {PostRepository} from "../repositories/post.repository";
import {BearerAuthGuard, SoftBearerAuthGuard} from "../../../infrastructure/guards/user-guard";
import {CommentsQueryRepository} from "../../comments/comment.query.repository";
import {UpdateCommentDto, updateLikeDto} from "../../../models/comments-models";
import {User} from "../../users/user.entity";
import {CommentService} from "../../comments/comment.service";
import {UserAll, UserId} from "../../../infrastructure/decorators/get-user.decorator";
import {BasicAuthGuard} from "../../../infrastructure/guards/basic-auth-guard.service";
import {CommandBus} from "@nestjs/cqrs";
import {UpdatePostCommand} from "../application/usecases/update-post.usecase";
import {DeletePostCommand} from "../application/usecases/delete-blog.usecase";
import {AddLikesByPostCommand} from "../application/usecases/add-likes-by-post.usecase";
import {PostsQueryType} from "./models/output";
import {createPostDto, likesDto, UpdatePostDto} from "./models/input";


@Controller('posts')
export class PostController {
    constructor(private readonly postsQueryRepository: PostsQueryRepository,
                private readonly postService: PostService,
                private commandBus: CommandBus,
                private readonly commentService: CommentService,
                private readonly postRepository: PostRepository,
                private readonly commentQueryRepository: CommentsQueryRepository) {
    }

    @Get()
    @UseGuards(SoftBearerAuthGuard)
    async getPosts(@Query() queryDto: PostsQueryType, @UserId() userId: string | null) {
        const pagination = getQueryPagination(queryDto);
        const arr = await this.postsQueryRepository.readPosts(pagination, userId);
        return arr
    }

    @Get(':id')
    @UseGuards(SoftBearerAuthGuard)
    async getPostById(@Param('id') postId: string, @UserId() userId: string | null) {
        let foundId = await this.postsQueryRepository.readPostId(postId, userId);
        if (foundId) {
            return foundId
        } else throw new NotFoundException('Post with this id not found')
    }

    @Post()
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async createPosts(@Body() postDto :  createPostDto) {
        const newPost = await this.postService.createPost(postDto);
        return newPost
    }

    @Put(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async updatePost(@Param('id') postId: string,
                     @Body() postDto:  UpdatePostDto) {

        let postUpdate = await this.commandBus.execute(new UpdatePostCommand(postId,postDto));
        if (postUpdate) {
            return postUpdate
        } else throw new NotFoundException('Post with this id not found')
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deletePost(@Param('id') postId: string) {

        const isDeleted = await this.commandBus.execute(new DeletePostCommand(postId));
        if (isDeleted) {
            return isDeleted
        } else throw new NotFoundException('Blog with this id not found');
    }

    @Get(':postId/comments')
    @UseGuards(SoftBearerAuthGuard)
    async getCommentByPostId(@Query() queryDto: PostsQueryType, @Param('postId') postId: string, @UserId() userId: string | null) {
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
    @UseGuards(BearerAuthGuard)
    async createCommentByPostId(@Param('postId') postId: string, @Body() dto: UpdateCommentDto, @UserAll() user: User) {
        const post = await this.postRepository.readPostId(postId);
        if (!post) throw new NotFoundException();

        const userId = user!._id.toString();
        const userLogin =user!.login;
        const newComment = await this.commentService.createComment(post._id.toString(), userId, userLogin, dto.content);
        return newComment;
    }

    @Put(':postId/like-status')
    @HttpCode(204)
    @UseGuards(BearerAuthGuard)
    async updateLikeStatus(@Param('postId') postId: string, @Body() body : likesDto , @UserId() userId: string  ) {
        const post = await this.postRepository.readPostId(postId)
        if(!post) throw new NotFoundException('Post with this id not found')
        let addLikes = await this.commandBus.execute(new AddLikesByPostCommand(postId, userId, body.likeStatus))
        if(!addLikes) {
            throw new NotFoundException();
        }
        return addLikes
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