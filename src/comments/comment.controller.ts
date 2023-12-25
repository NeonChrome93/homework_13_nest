import {Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Put, Req, UseGuards} from "@nestjs/common";
import {CreateCommentDto, updateLikeDto} from "../models/comments-models";
import {CommentsQueryRepository} from "./comment.query.repository";
import {CommentService} from "./comment.service";
import {authMiddleware} from "../guards/user-guard";
import {UserId} from "../common/decorators/get-user.decorator";


@Controller('comments')

export class CommentController {
    constructor(
        private readonly commentsQueryRepository: CommentsQueryRepository,
        private readonly commentService: CommentService
    ) {
    }

    @Get(':id')
    async getCommentbyId(@Param('id') commentId: string) {
        const userId : string | null = null//req.userId


        let foundId = await this.commentsQueryRepository.readCommentId(commentId, userId)
        if (foundId) {
            return foundId
        } else throw new NotFoundException('Comment with id not found')

    }

    @Put(':id')
    @HttpCode(204)
    async updateCommentById(@Param('id') commentId: string, @Body() commentDto: CreateCommentDto) {


        let foundId = await this.commentService.updateComment(commentId, commentDto)
        if (foundId) {
            foundId;
        } else throw new NotFoundException('Comment with id not found');

    }

    @Put(':commentId/like-status')
    @UseGuards(authMiddleware)
    async updateLikeStatus(@Param('commentId') commentId: string, @Body() dto:  updateLikeDto, @UserId() userId: string) {


        // console.log(status, "likestatus")
        // console.log(await CommentModel.findOne({_id: new ObjectId(comment)}))

        let addLikes = await this.commentService.addReaction(commentId, userId, dto.status)

        // console.log(await CommentModel.findOne({_id: new ObjectId(comment)}))
        if (addLikes) {
            return addLikes;
        } else throw new NotFoundException('Comment with id not found');

    }

//1) добавить лайк в сервисе 2)добавить сохранение в БД  обновленной БД модели 3) получение по статусу
    @Delete(':id')
    @HttpCode(204)
    async deleteCommentById(@Param('id') commentId: string) {
        let isDeleted = await this.commentService.deleteComment(commentId)
        if (isDeleted) {
            return isDeleted;
        } else throw new NotFoundException('Comment with id not found');
    }
}