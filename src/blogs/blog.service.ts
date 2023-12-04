
import {BlogRepository} from "./blog.repository";
import {Injectable} from "@nestjs/common";
import {Blog, BlogsOutputType, CreateBlogType, UpdateBlogType} from "../models/blogs-models";

// query - get
// commands - post | put | delete
//todo also update blogName in posts
// updateBlog(updateBlogDto){
@Injectable()
export class BlogService {
    constructor(private readonly blogRepository: BlogRepository,
    ) {
    }


    async createBlog(newBlogFromRequest: CreateBlogType): Promise<BlogsOutputType> {
        const dateNow = new Date()

        const newBlog: Blog =  new Blog(
            newBlogFromRequest.name,
            newBlogFromRequest.description,
            newBlogFromRequest.websiteUrl,
            dateNow.toISOString(),
            false)

        return this.blogRepository.createBlog(newBlog)
    }


    async updateBlogs(id: string, newUpdateRequest: UpdateBlogType): Promise<boolean> {
        const blog = await this.blogRepository.readBlogsId(id)
        if (!blog) return false
        return this.blogRepository.updateBlogs(id, newUpdateRequest)
    }


    async deleteBlogs(id: string): Promise<boolean> {
        const blog = await this.blogRepository.readBlogsId(id)
        if (!blog) return false
        return this.blogRepository.deleteBlogs(id)
    }


}

