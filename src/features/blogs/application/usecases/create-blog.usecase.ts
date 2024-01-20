import {Injectable} from "@nestjs/common";
import {BlogRepository} from "../../repositories/blog.repository";
import {CreateBlogDto} from "../../api/models/input/blog.input.model";
import {BlogsViewType} from "../../api/models/output/blog.output.model";
import {Blog} from "../../domain/blog.entity";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";

export class CreateBlogCommand {
    constructor(public blogDto: CreateBlogDto) {
    }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand>
{
    constructor(private readonly blogRepository: BlogRepository,
    ) {
    }
    async execute(command: CreateBlogCommand ): Promise<BlogsViewType> {

        const newBlog: Blog = new Blog(command.blogDto.name, command.blogDto.description,command.blogDto.websiteUrl,false)

        return  this.blogRepository.createBlog(newBlog)
    }

}




