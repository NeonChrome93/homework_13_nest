import {UpdateBlogTypeDto} from "../../api/models/input/blog.input.model";
import {BlogRepository} from "../../repositories/blog.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";

export class UpdateBlogCommand {
    constructor(public id: string, public newUpdateRequest: UpdateBlogTypeDto) {
    }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
    constructor(private readonly blogRepository: BlogRepository,
    ) {
    }

    async execute(command:UpdateBlogCommand): Promise<boolean> {
        const blog = await this.blogRepository.readBlogsId(command.id)
        if (!blog) return false
        return this.blogRepository.updateBlogs(command.id, command.newUpdateRequest)
    }
}