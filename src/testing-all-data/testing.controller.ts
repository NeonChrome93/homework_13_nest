
import {Controller, Delete, HttpCode} from "@nestjs/common";
import {PostRepository} from "../features/posts/repositories/post.repository";
import {BlogRepository} from "../features/blogs/repositories/blog.repository";
import {UsersRepository} from "../features/users/repositories/user.repository";
import {CommentRepository} from "../features/comments/repositories/comment.repository";



@Controller('testing')
export class DelController {
    constructor(private readonly postRepository: PostRepository,
                private readonly blogRepository: BlogRepository,
                private readonly usersRepository: UsersRepository,
                private readonly commentRepository: CommentRepository) {
    }

    @Delete('all-data')
    @HttpCode(204)
    async  DeleteAllData() {
       await Promise.all([
            this.blogRepository.deleteAllBlogs(),
            this.postRepository.deleteAllPosts(),
             this.usersRepository.deleteAllUsers(),
             this.commentRepository.deleteAllComments()
        ]);


    }
}
