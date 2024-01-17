
import {PostRepository} from "../../repositories/post.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UpdatePostDto} from "../../api/models/input";

export class UpdatePostCommand {
    constructor(public postId: string, public newUpdateRequest: UpdatePostDto) {
    }
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand>{
    constructor(private readonly postRepository: PostRepository) {
    }
    async execute(command:UpdatePostCommand): Promise<boolean> {
        let post = await this.postRepository.readPostId(command.postId)
        if (!post) return false
        return this.postRepository.updatePosts(command.postId, command.newUpdateRequest)

    }
}