import {ObjectId} from "mongodb";
import mongoose, {FilterQuery, Model, UpdateQuery} from "mongoose";
import {Injectable} from "@nestjs/common";
import { BlogsViewType, UpdateBlogType} from "../models/blogs-models";
import {InjectModel} from "@nestjs/mongoose";
import {Blog, BlogDbType, BlogDocument} from "./blog.entity";
import {blogMapper} from "../utils/mappers/blogs-mapper";
import {PostViewType} from "../models/posts-models";
import {postDbType} from "../posts/post.entity";
import {likesMapper} from "../utils/mappers/likes-mapper";


//todo also update blogName in posts
// updateBlog(updateBlogDto){
@Injectable()
export class BlogRepository {
    constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {
    }

    async readBlogsId(id: string) {
        return await this.BlogModel.findOne({_id: new ObjectId(id)}).exec()//only for logic for services

    }

    async createBlog(newBlog: BlogDbType): Promise<BlogsViewType> {


        const _blog = new this.BlogModel(newBlog)
        // console.log(_blog)
        // _blog._id = new mongoose.Types.ObjectId()
        await _blog.save();

        const items: BlogsViewType = blogMapper(_blog)

        return { ...items}
        //  return {
        //     id: _blog._id.toString(),
        //     ...newBlog
        // }

    }


    async updateBlogs(id: string, newUpdateRequest: UpdateBlogType): Promise<boolean> {

        // blogUpdate.name = newUpdateRequest.name,
        // blogUpdate.description = newUpdateRequest.description,
        // blogUpdate.websiteUrl = newUpdateRequest.websiteUrl
        const res = await this.BlogModel.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    name: newUpdateRequest.name,
                    description: newUpdateRequest.description, websiteUrl: newUpdateRequest.websiteUrl
                }
            }
        ).exec()
        return res.matchedCount === 1

    }


    async deleteBlogs(id: string): Promise<boolean> {

        try {
            const filter = {_id: id}
            const res = await this.BlogModel.deleteOne(filter).exec()
            return res.deletedCount === 1
        } catch (e) {
            return false
        }

    }

    async deleteAllBlogs(): Promise<boolean> {
        // dbLocal.blogs = [];
        await this.BlogModel.deleteMany({})
        return true
    }

}


