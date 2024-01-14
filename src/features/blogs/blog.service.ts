
import {BlogRepository} from "./blog.repository";
import {Injectable} from "@nestjs/common";
import { BlogsViewType, CreateBlogDto, UpdateBlogTypeDto} from "../../models/blogs-models";
import {Blog, BlogDbType} from "./blog.entity";
import mongoose from "mongoose";

// query - get
// commands - post | put | delete
//todo also update blogName in posts
// updateBlog(updateBlogDto){
@Injectable()
export class BlogService {
    constructor(private readonly blogRepository: BlogRepository,
    ) {
    }


    async createBlog(newBlogFromRequest: CreateBlogDto): Promise<BlogsViewType> {

        const newBlog: Blog = new Blog(newBlogFromRequest.name,newBlogFromRequest.description, newBlogFromRequest.websiteUrl, false)

       return  this.blogRepository.createBlog(newBlog)
    }


    async updateBlogs(id: string, newUpdateRequest: UpdateBlogTypeDto): Promise<boolean> {
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

