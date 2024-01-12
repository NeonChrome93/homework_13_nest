//import { postCollection} from "../../db/database";

import {Filter, ObjectId} from "mongodb";

import mongoose, {FilterQuery, Model} from "mongoose";
import {Post, postDbType, PostDocument} from "./post.entity";
import {PostType, PostViewType, UpdatePostDto} from "../../models/posts-models";
import {REACTIONS_ENUM} from "../../models/comments-models";
import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class PostRepository {
constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {
}



    async readPostId(postId: string): Promise<postDbType | null> {
        if (!ObjectId.isValid(postId)) return null
        return this.PostModel.findOne({_id: new ObjectId(postId)});

    }

    async createPost(newPost: PostType): Promise<PostViewType> {

        const _post = new this.PostModel(newPost)
        console.log(_post)
        _post._id = new mongoose.Types.ObjectId()
        await _post.save()
        return {
            id: _post._id.toString(),
            ...newPost,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: REACTIONS_ENUM.None,
                newestLikes: []
            }
       }
    }

    async updatePosts(postId: string, newUpdateRequest: UpdatePostDto): Promise<boolean> {

        const res = await this.PostModel.updateOne({_id: new ObjectId(postId)}, {
            $set: {
                title: newUpdateRequest.title, shortDescription: newUpdateRequest.shortDescription,
                content: newUpdateRequest.content, blogId: newUpdateRequest.blogId
            }
        }).exec()
        return res.matchedCount === 1;

    }

    async updatePostReaction(post: postDbType) {
        return this.PostModel.updateOne({_id: post._id}, {
            $set: {...post}
        })
    }

    async deletePosts(postId: string): Promise<boolean> {

        try {
            const filter = {_id: new ObjectId(postId)}
            const res = await this.PostModel.deleteOne(filter).exec()
            return res.deletedCount === 1;
        } catch (e) {
            return false
        }


    }

    async deleteAllPosts() {
        await this.PostModel.deleteMany({});
        return true
    }


}