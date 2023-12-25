
import {BlogRepository} from "./blog.repository";
import {Injectable} from "@nestjs/common";
import {Blog, BlogsViewType, CreateBlogDto, UpdateBlogType} from "../models/blogs-models";
import {BlogDbType} from "./blog.entity";
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
        const dateNow = new Date()


        const newBlog: BlogDbType = {
            _id: new mongoose.Types.ObjectId(),
            name: newBlogFromRequest.name,
            description: newBlogFromRequest.description,
            websiteUrl: newBlogFromRequest.websiteUrl,
            createdAt: dateNow,
            isMembership: false
        }

       return  this.blogRepository.createBlog(newBlog)



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

