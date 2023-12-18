import {CommentDocument, CommentsDBType} from "./comment.entity";

import {InjectModel} from "@nestjs/mongoose";
import {Model, Schema, Types} from "mongoose";
import {UpdateCommentType} from "../models/comments-models";
import {ObjectId} from "mongodb";
import {Injectable} from "@nestjs/common";

@Injectable()
export class CommentRepository  {
constructor(@InjectModel(Comment.name) private CommentModel: Model<CommentDocument> ) {
}

    async readCommentIdDbType(id: string): Promise<CommentsDBType | null> {
        if (!ObjectId.isValid(id)) return null
        return this.CommentModel.findOne({_id: new ObjectId(id)})
    }

    async createComment(newComment: CommentsDBType): Promise<boolean> {

        await this.CommentModel.create({...newComment})
        return true
    }

    async updateComment(commentId: string, newUpdateRequest: UpdateCommentType): Promise<boolean> {

        const res = await this.CommentModel.updateOne({_id: new ObjectId(commentId)}, {
                $set: {content: newUpdateRequest.content}
            }
        ).exec()

        return res.matchedCount === 1;
    }

    async deleteComment(commentId: string): Promise<boolean> {
        try {
            const filter = {_id: new ObjectId(commentId)}
            const res = await this.CommentModel.deleteOne(filter).exec()
            return res.deletedCount === 1;
        } catch (e) {
            return false
        }
    }


    async deleteAllComments(): Promise<boolean> {
        // dbLocal.blogs = [];
        await this.CommentModel.deleteMany({})
        return true
    }

    async updateCommentReactions(comment: CommentsDBType) {
        return this.CommentModel.updateOne({_id: comment._id}, {
            $set: {...comment}
        })
    }
}