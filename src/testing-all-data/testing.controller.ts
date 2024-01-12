
import {Controller, Delete, HttpCode} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Post, PostDocument} from "../features/posts/post.entity";
import {Model} from "mongoose";
import {PostRepository} from "../features/posts/post.repository";
import {BlogRepository} from "../features/blogs/blog.repository";
import {UsersRepository} from "../features/users/user.repository";



@Controller('testing')
export class DelController {
    constructor(private readonly postRepository: PostRepository,
                private readonly blogRepository: BlogRepository,
                private readonly usersRepository: UsersRepository) {
    }

    @Delete('all-data')
    @HttpCode(204)
    async  DeleteAllData() {
       await Promise.all([
            this.blogRepository.deleteAllBlogs(),
            this.postRepository.deleteAllPosts(),
             this.usersRepository.deleteAllUsers(),
            // commentRepository.deleteAllComments()
        ]);


    }
}
