
import {Controller, Delete, HttpCode} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Post, PostDocument} from "../posts/post.entity";
import {Model} from "mongoose";
import {PostRepository} from "../posts/post.repository";
import {BlogRepository} from "../blogs/blog.repository";



@Controller('testing')
export class DelController {
    constructor(private readonly postRepository: PostRepository,
                private readonly blogRepository: BlogRepository) {
    }

    @Delete('all-data')
    @HttpCode(201)
    async  DeleteAllData() {
       await Promise.all([
            this.blogRepository.deleteAllBlogs(),
            this.postRepository.deleteAllPosts(),
            // usersRepository.deleteAllUsers(),
            // commentRepository.deleteAllComments()
        ]);


    }
}
