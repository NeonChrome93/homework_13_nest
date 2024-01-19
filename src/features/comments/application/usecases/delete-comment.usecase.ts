import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CommentsQueryRepository} from "../../repositories/comment.query.repository";
import {CommentRepository} from "../../repositories/comment.repository";

export class DeleteCommentCommand {
    constructor(public commentId: string) {
    }
}
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler< DeleteCommentCommand> {
    constructor(private readonly commentsQueryRepository: CommentsQueryRepository,
                private readonly commentRepository: CommentRepository) {
    }

    async execute(command:DeleteCommentCommand): Promise<boolean> {
        let comment = await this.commentsQueryRepository.readCommentId(command.commentId)
        if (!comment) return false
        return this.commentRepository.deleteComment(command.commentId)
    }
}