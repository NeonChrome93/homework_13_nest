import {FilterQuery, Model} from "mongoose";
import {ObjectId} from "mongodb";
import {Injectable} from "@nestjs/common";
import {QueryPaginationType} from "../../../utils/pagination";
import {Blog, BlogDbType, BlogDocument} from "../domain/blog.entity";
import {InjectModel} from "@nestjs/mongoose";
import {PaginationModels} from "../../../models/pagination-models";
import {Post, postDbType, PostDocument} from "../../posts/domain/post.entity";
import {likesMapper} from "../../../utils/mappers/likes-mapper";
import {BlogsViewType} from "../api/models/output/blog.output.model";
import {PostViewType} from "../../posts/api/models/output/post-output.model";
import {PostType} from "../../posts/api/models/input/post-input.model";




@Injectable()
export class BlogQueryRepository  {
constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
            @InjectModel(Post.name) private PostModel: Model<PostDocument>) {

}

    async readBlogs(pagination: QueryPaginationType): Promise<PaginationModels<BlogsViewType[]>> {

        const filter: FilterQuery<BlogDbType> = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}



        const blogs = await this.BlogModel
            .find(filter, null, {lean: true})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .lean()
            .exec()

        const totalCount = await this.BlogModel.countDocuments(filter).exec()
        const items: BlogsViewType[] = blogs.map((b) => ({
            id: b._id.toString(),
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl,
            createdAt: b.createdAt.toISOString(),
            isMembership: b.isMembership


        }))
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items
        }
    }

    async readBlogsId(id: string): Promise<BlogsViewType | null> {
        const blog  = await this.BlogModel.findOne({_id: new ObjectId(id)}).exec()//logic

        if (!blog) {
            return null;
        }

        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt.toISOString(),
            isMembership: blog.isMembership
        }
    }

    async readPostsByBlogId(blogId: string, pagination: QueryPaginationType, userId?: string | null ): Promise<PaginationModels<PostViewType[]>>{
        const filter: FilterQuery<PostType> = {blogId}
        const posts = await this.PostModel
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments(filter).exec()
        const items: PostViewType[] = posts.map((p: postDbType) => likesMapper(p, userId))
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }

}