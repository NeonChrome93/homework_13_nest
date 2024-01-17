import {Injectable} from "@nestjs/common";
import { PostType} from "../../../models/posts-models";
import {PostRepository} from "../repositories/post.repository";
import {BlogRepository} from "../../blogs/repositories/blog.repository";
import {UsersRepository} from "../../users/user.repository";
import {createPostDto} from "../api/models/input";
import {PostViewType} from "../api/models/output";

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository,
                private readonly blogRepository: BlogRepository,
                private readonly usersRepository: UsersRepository) {
    }


    // async readPosts(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {
    //     return postRepository.readPosts(pagination)
    // }
    //
    // async readPostId(postId: string) {
    //     return postRepository.readPostId(postId)
    // }

    async createPost(inputDto: createPostDto) : Promise<PostViewType | null> {
        const blog = await this.blogRepository.readBlogsId(inputDto.blogId)
        if (!blog) return null
        const newPost: PostType = {
            ...inputDto,
            blogName: blog.name,
            createdAt: new Date().toISOString(),

        }
        return  this.postRepository.createPost(newPost)

    }

    // async addLikesByPost(postId: string, userId: string, status: REACTIONS_ENUM): Promise<boolean> {
    //     let post = await this.postRepository.readPostId(postId)
    //     let user = await this.usersRepository.readUserById(userId.toString()) //login: user!.login
    //
    //     if (!post) return false
    //     const reactions = post.reactions.find(r => r.userId == userId)
    //
    //     if (!reactions) {
    //
    //         post.reactions.push({ userId, status, createdAt: new Date(), login: user!.login})
    //     } else {
    //         //reactions.userId = userId
    //         reactions.createdAt = new Date()
    //         reactions.status = status
    //         post.reactions.map((r) => r.userId === userId ? {...r, ...reactions} : r )
    //         // Таким образом, строка кода обновляет массив реакций комментария,
    //         //     заменяя существующую реакцию пользователя на новую реакцию, если идентификаторы пользователей совпадают.
    //
    //     }
    //     await this.postRepository.updatePostReaction(post)
    //     return true
    // }





}

