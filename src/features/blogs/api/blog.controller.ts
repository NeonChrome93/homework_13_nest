import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request, UseGuards
} from "@nestjs/common";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {BlogRepository} from "../repositories/blog.repository";
import {getQueryPagination} from "../../../utils/pagination";
import {PostService} from "../../posts/application/post.service";
import {BasicAuthGuard} from "../../../infrastructure/guards/basic-auth-guard.service";
import {BearerAuthGuard, SoftBearerAuthGuard} from "../../../infrastructure/guards/user-guard";
import {UserId} from "../../../infrastructure/decorators/get-user.decorator";
import {BlogsQueryType, CreateBlogDto, UpdateBlogTypeDto} from "./models/input/create-blog.input.model";
import {CommandBus} from "@nestjs/cqrs";
import {CreateBlogCommand} from "../application/usecases/create-blog.usecase";
import {DeleteBlogCommand} from "../application/usecases/delete-blog-usecase";
import {UpdateBlogCommand} from "../application/usecases/update.blog.usecase";
import {createPostByBlogIdDto} from "../../posts/api/models/input";







@Controller('blogs')
export class BlogController {
    constructor(private readonly blogQueryRepository: BlogQueryRepository,
                private commandBus: CommandBus,
                private readonly postService: PostService,
                private readonly blogRepository: BlogRepository,) {
    }

    @Get()
    //@HttpCode(204)
    async getBlogs(@Query() queryDto: BlogsQueryType) {
        const pagination = getQueryPagination(queryDto)
        const arr = await this.blogQueryRepository.readBlogs(pagination);
        return arr;
    }

    @Get(':id')
    async getBlogById(@Param('id') id: string) {
        //const blogId = req.params.id
        let foundId = await this.blogQueryRepository.readBlogsId(id);
        if (foundId) {
            return foundId
        } else throw new NotFoundException('Blog with this id not found')
    }

    @Post()
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async createBlog(@Body() blogDto: CreateBlogDto) {
        const newBlog = await this.commandBus.execute(new CreateBlogCommand(blogDto))
        return newBlog
    }

    @Put(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async updateBlog(@Param('id') id: string,
                     @Body() blogDto: UpdateBlogTypeDto) {
        let blogUpdate = await this.commandBus.execute(new UpdateBlogCommand(id, blogDto))
        if (blogUpdate) {
            return blogUpdate
        } else throw new NotFoundException('Blog with this id not found')

    }



    @Get(':blogId/posts')
    @UseGuards(SoftBearerAuthGuard)
    async getPostByBlogId(@Param('blogId') blogId: string,
                          @Request() req: Request,
                          @Query() queryDto: BlogsQueryType,
                           @UserId() userId: string
    ) {

        const pagination = getQueryPagination(queryDto)
        const blog = await this.blogRepository.readBlogsId(blogId)
        if (!blog)  throw new NotFoundException('Blog with this id not found')
        const arr = await this.blogQueryRepository.readPostsByBlogId(blogId, pagination, userId); //servis
       return arr
    }

    @Post(':blogId/posts')
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async createPostByBlogId(@Param('blogId') blogId: string, @Body() postDto: createPostByBlogIdDto) {
        const post = await this.postService.createPost({...postDto, blogId})
        if (!post)  throw new NotFoundException('Blog with this id not found')
        return post
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    async deleteBlog(@Param('id') id: string) {

        const isDeleted = await this.commandBus.execute(new DeleteBlogCommand(id))
        if (isDeleted) {
            return isDeleted
        } else throw new NotFoundException('Blog with this id not found')
    }

}

//const blogControllerInstance = new BlogController()

// blogsRouter.get('/', blogControllerInstance.getBlogs)
//
// blogsRouter.get('/:id', blogControllerInstance.getBlogById)
//
// blogsRouter.post('/',authGuardMiddleware, ...validationCreateUpdateBlog, blogControllerInstance.createBlog)
//
// blogsRouter.put('/:id', authGuardMiddleware, ...validationCreateUpdateBlog, blogControllerInstance.updateBlog)
//
// blogsRouter.delete('/:id',  authGuardMiddleware, blogControllerInstance.deleteBlog)
//
// blogsRouter.get('/:id/posts', getUserMiddleware, blogControllerInstance.getPostByBlogId)
//
// blogsRouter.post('/:id/posts', authGuardMiddleware, ...validationCreatePostWithoutBlogId, blogControllerInstance.createPostByBlogId)