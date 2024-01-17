import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostRepository} from "../../repositories/post.repository";


export class DeletePostCommand {
    constructor(public postId: string) {
    }
}
@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand>{
    constructor(private readonly postRepository: PostRepository) {
    }

    async execute(command:DeletePostCommand) {
        let post = await this.postRepository.readPostId(command.postId)
        if (!post) return false
        return this.postRepository.deletePosts(command.postId)
    }

}