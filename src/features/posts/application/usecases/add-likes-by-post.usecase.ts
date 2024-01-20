import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostRepository} from "../../repositories/post.repository";
import {BlogRepository} from "../../../blogs/repositories/blog.repository";
import {UsersRepository} from "../../../users/repositories/user.repository";
import {REACTIONS_ENUM} from "../../../comments/api/models/output/comments.output.models";

export class AddLikesByPostCommand {
    constructor(public postId: string, public userId: string, public status: REACTIONS_ENUM) {
    }
}

@CommandHandler(AddLikesByPostCommand)
export class AddLikesByPostUseCase implements ICommandHandler<AddLikesByPostCommand> {
    constructor(private readonly postRepository: PostRepository,
                private readonly usersRepository: UsersRepository) {
    }

    async execute(command: AddLikesByPostCommand): Promise<boolean> {
        let post = await this.postRepository.readPostId(command.postId)
        let user = await this.usersRepository.readUserById(command.userId.toString()) //login: user!.login

        if (!post) return false
        const reactions = post.reactions.find(r => r.userId == command.userId)

        if (!reactions) {

            post.reactions.push({userId: command.userId, login: user!.login, createdAt: new Date(),status:  command.status})
        } else {
            //reactions.userId = userId
            reactions.createdAt = new Date()
            reactions.status = command.status
            post.reactions.map((r) => r.userId === command.userId ? {...r, ...reactions} : r)
            // Таким образом, строка кода обновляет массив реакций комментария,
            //     заменяя существующую реакцию пользователя на новую реакцию, если идентификаторы пользователей совпадают.

        }
        await this.postRepository.updatePostReaction(post)
        return true
    }

}