import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UpdateCommentDto} from "../../api/models/input/comment.input.model";
import {CommentsQueryRepository} from "../../repositories/comment.query.repository";
import {CommentRepository} from "../../repositories/comment.repository";

export class  UpdateCommentCommand {
    constructor(public commentId: string, public newUpdateRequest: UpdateCommentDto) {
    }
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
    constructor(private readonly commentsQueryRepository: CommentsQueryRepository,
                private readonly commentRepository: CommentRepository) {
    }

    async execute(command:UpdateCommentCommand): Promise<boolean> {
        let comment = await this.commentsQueryRepository.readCommentId(command.commentId)
        if (!comment) return false
        return this.commentRepository.updateComment(command.commentId, command.newUpdateRequest)

    }

}