import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import e from "express";
import {BlogRepository} from "../../repositories/blog.repository";

export class DeleteBlogCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand>{

    constructor(private readonly blogRepository: BlogRepository,
    ) {
    }

    async execute(command: DeleteBlogCommand): Promise<boolean> {
        const blog = await this.blogRepository.readBlogsId(command.id)
        if (!blog) return false
        return this.blogRepository.deleteBlogs(command.id)
    }

}
