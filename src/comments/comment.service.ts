import {CommentsViewType, REACTIONS_ENUM, UpdateCommentType} from "../models/comments-models";
import {CommentsDBType} from "./comment.entity";
import mongoose from "mongoose";
import {CommentsQueryRepository} from "./comment.query.repository";
import {Injectable} from "@nestjs/common";
import {CommentRepository} from "./comment.repository";


@Injectable()
export class CommentService {
    constructor(private readonly commentsQueryRepository: CommentsQueryRepository,
                private readonly commentRepository: CommentRepository) {
    }


    async createComment(postId: string, userId: string, userLogin: string, content: string): Promise<CommentsViewType> {
        const newComment: CommentsDBType = {
            _id: new mongoose.Types.ObjectId(),
            postId,
            content,
            commentatorInfo: {
                userId,
                userLogin
            },
            createdAt: new Date(),
            reactions: []
        }
        await this.commentRepository.createComment(newComment)
        return {
            id: newComment._id.toString(),
            content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt.toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: REACTIONS_ENUM.None
            }
        }
    }

    async addReaction(commentId: string, userId: string, status: REACTIONS_ENUM): Promise<boolean> {
        let comment = await this.commentRepository.readCommentIdDbType(commentId)
        if (!comment) return false
        const reaction = comment.reactions.find(r => r.userId === userId)
        if (!reaction) {
            comment.reactions.push({userId, status, createdAt: new Date()})
        } else {
            reaction.status = status
            reaction.createdAt = new Date()
            //const newArray=  comment.reactions.map((r) => r.userId === reaction.userId ? {...r, ...reaction} : r)
            comment.reactions = comment.reactions.map((r) => r.userId === reaction.userId ? {...r, ...reaction} : r)
        }
        await this.commentRepository.updateCommentReactions(comment)
        return true
    }


    async updateComment(commentId: string, newUpdateRequest: UpdateCommentType): Promise<boolean> {
        let comment = await this.commentsQueryRepository.readCommentId(commentId)
        if (!comment) return false
        return this.commentRepository.updateComment(commentId, newUpdateRequest)

    }


    async deleteComment(commentId: string): Promise<boolean> {
        let comment = await this.commentsQueryRepository.readCommentId(commentId)
        if (!comment) return false
        return this.commentRepository.deleteComment(commentId)
    }
}