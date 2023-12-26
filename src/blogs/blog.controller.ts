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
import {BlogQueryRepository} from "./blog.query.repository";
import {BlogService} from "./blog.service";
import {BlogRepository} from "./blog.repository";
import {getQueryPagination} from "../utils/pagination";
import {BlogsQueryType, CreateBlogDto, UpdateBlogTypeDto} from "../models/blogs-models";
import {createPostDto} from "../models/posts-models";
import {PostService} from "../posts/post.service";
import {AuthGuard} from "../guards/auth.guard";







@Controller('blogs')
export class BlogController {
    constructor(private readonly blogQueryRepository: BlogQueryRepository,
                private readonly blogService: BlogService,
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
    @UseGuards(AuthGuard)
    async createBlog(@Body() blogDto: CreateBlogDto) {
        const newBlog = await this.blogService.createBlog(blogDto)
        return newBlog
    }

    @Put(':id')
    @HttpCode(204)
    async updateBlog(@Param('id') id: string,
                     @Body() blogDto: UpdateBlogTypeDto) {
        let blogUpdate = await this.blogService.updateBlogs(id, blogDto)
        if (blogUpdate) {
            return blogUpdate
        } else throw new NotFoundException('Blog with this id not found')

    }



    @Get(':id/posts')

    async getPostByBlogId(@Param('id') blogId: string,
                          @Request() req: Request,
                          @Query() queryDto: BlogsQueryType
                          // @UserId() userId: string
    ) {
        const userId = null
        const pagination = getQueryPagination(queryDto)
        const blog = await this.blogRepository.readBlogsId(blogId)
        if (!blog)  throw new NotFoundException('Blog with this id not found')
        const arr = await this.blogQueryRepository.readPostsByBlogId(blogId, pagination, userId); //servis
       return arr
    }

    @Post(':id/posts')
    @HttpCode(201)
    async createPostByBlogId(@Param('id') blogId: string,@Body() postDto: createPostDto) {
        const post = await this.postService.createPost({...postDto, blogId})
        if (!post)  throw new NotFoundException('Blog with this id not found')
        return post
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteBlog(@Param('id') id: string) {

        const isDeleted = await this.blogService.deleteBlogs(id)
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