import {PostRepository} from "../../repositories/post.repository";
import {BlogRepository} from "../../../blogs/repositories/blog.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {createPostDto, PostType} from "../../api/models/input/post-input.model";
import {PostViewType} from "../../api/models/output/post-output.model";

export class CreatePostCommand {
    constructor(public inputDto: createPostDto) {
    }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand>{
    constructor(private readonly postRepository: PostRepository,
                private readonly blogRepository: BlogRepository) {

    }

    async execute(command: CreatePostCommand ) : Promise<PostViewType | null> {
        const blog = await this.blogRepository.readBlogsId(command.inputDto.blogId)
        if (!blog) return null
        const newPost: PostType = {
            ...command.inputDto,
            blogName: blog.name,
            createdAt: new Date().toISOString(),

        }
        return  this.postRepository.createPost(newPost)

    }
}