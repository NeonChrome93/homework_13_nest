


import {Injectable} from "@nestjs/common";
import {createPostType, PostType, UpdatePostType} from "../models/posts-models";
import {PostRepository} from "./post.repository";
import {BlogRepository} from "../blogs/blog.repository";
import {REACTIONS_ENUM} from "../models/comments-models";

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository,
                private readonly blogRepository: BlogRepository) {
    }


    // async readPosts(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {
    //     return postRepository.readPosts(pagination)
    // }
    //
    // async readPostId(postId: string) {
    //     return postRepository.readPostId(postId)
    // }

    async createPost(input: createPostType) {
        const blog = await this.blogRepository.readBlogsId(input.blogId)
        if (!blog) return null
        const newPost: PostType = {
            ...input,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
            reactions: []
        }
        return this.postRepository.createPost(newPost)
        //const post = await this.postRepository.createPost(newPost)
        // const likesInfto = {
        //     postId : post._id,
        //     likes: 0,
        //     dislake: 0,
        // }

        // await this.likesInfo.create(likesInfo)
    }

    async addLikesByPost(postId: string, userId: string, status: REACTIONS_ENUM): Promise<boolean> {
        let post = await this.postRepository.readPostId(postId)
        //let user = await usersRepository.readUserById(userId.toString()) login: user!.login

        if (!post) return false
        const reactions = post.reactions.find(r => r.userId == userId)

        if (!reactions) {

            post.reactions.push({ userId, status, createdAt: new Date(), login: 'yaro'})
            console.log('reaction:',post.reactions[0])
        } else {
            //reactions.userId = userId
            reactions.createdAt = new Date()
            reactions.status = status
            post.reactions.map((r) => r.userId === userId ? {...r, ...reactions} : r )
            // Таким образом, строка кода обновляет массив реакций комментария,
            //     заменяя существующую реакцию пользователя на новую реакцию, если идентификаторы пользователей совпадают.

        }
        await this.postRepository.updatePostReaction(post)
        return true
    }

    async updatePosts(postId: string, newUpdateRequest: UpdatePostType): Promise<boolean> {
        let post = await this.postRepository.readPostId(postId)
        if (!post) return false
        return this.postRepository.updatePosts(postId, newUpdateRequest)

    }

    async deletePosts(postId: string) {


        let post = await this.postRepository.readPostId(postId)
        if (!post) return false
        return this.postRepository.deletePosts(postId)
    }

}

