import {CommentsDBType} from "../domain/comment.entity";
import mongoose from "mongoose";
import {CommentsQueryRepository} from "../repositories/comment.query.repository";
import {Injectable} from "@nestjs/common";
import {CommentRepository} from "../repositories/comment.repository";
import {REACTIONS_ENUM} from "../api/models/output/comments.output.models";
import {UpdateCommentDto} from "../api/models/input/comment.input.model";


@Injectable()
export class CommentService {
    constructor(private readonly commentsQueryRepository: CommentsQueryRepository,
                private readonly commentRepository: CommentRepository) {
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


    async updateComment(commentId: string, newUpdateRequest: UpdateCommentDto): Promise<boolean> {
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