import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {REACTIONS_ENUM} from "../../api/models/output/comments.output.models";
import {CommentRepository} from "../../repositories/comment.repository";


export class AddReactionCommand {
    constructor(public commentId: string, public userId: string, public status: REACTIONS_ENUM) {
    }
}

@CommandHandler(AddReactionCommand)
export class AddReactionUseCase implements ICommandHandler<AddReactionCommand> {
    constructor(private readonly commentRepository: CommentRepository) {
    }

    async execute(command:AddReactionCommand): Promise<boolean> {
        let comment = await this.commentRepository.readCommentIdDbType(command.commentId)
        if (!comment) return false
        const reaction = comment.reactions.find(r => r.userId === command.userId)
        if (!reaction) {
            comment.reactions.push({userId: command.userId, status: command.status, createdAt: new Date()})
        } else {
            reaction.status = command.status
            reaction.createdAt = new Date()
            //const newArray=  comment.reactions.map((r) => r.userId === reaction.userId ? {...r, ...reaction} : r)
            comment.reactions = comment.reactions.map((r) => r.userId === reaction.userId ? {...r, ...reaction} : r)
        }
        await this.commentRepository.updateCommentReactions(comment)
        return true
    }
}