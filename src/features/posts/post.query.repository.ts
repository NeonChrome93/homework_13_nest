
import {ObjectId} from "mongodb";
import {QueryPaginationType} from "../../utils/pagination";
import {PaginationModels} from "../../models/pagination-models";
import {NewestLikeType, PostViewType} from "../../models/posts-models";
import {Post, postDbType, PostDocument, StatusType} from "./post.entity";
import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, Model} from "mongoose";
import {REACTIONS_ENUM} from "../../models/comments-models";
import {likesMapper} from "../../utils/mappers/likes-mapper";
import {CommentsDBType} from "../comments/comment.entity";


@Injectable()
export class PostsQueryRepository {
constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {
}

    async readPosts(pagination: QueryPaginationType, userId?: string | null): Promise<PaginationModels<PostViewType[]>> {
        //const filter: FilterQuery<CommentsDBType> = {postId}
        const posts = await this.PostModel
            .find({})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments().exec()

        const items: PostViewType[] = posts.map((p: postDbType) => likesMapper(p, userId))
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }

    async readPostId(postId: string, userId?: string | null):Promise<PostViewType | null> {

        const post : postDbType | null  = await this.PostModel.findOne({_id: new ObjectId(postId)});

        if (!post) {
            return null;
        }

        const result = {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt.toISOString(),
            extendedLikesInfo: {
                likesCount: post.reactions.filter(r => r.status === REACTIONS_ENUM.Like).length,
                dislikesCount: post.reactions.filter(r => r.status === REACTIONS_ENUM.Dislike).length,
                myStatus: userId ?
                    (post.reactions.filter(r => r.userId === userId).length ? post.reactions.filter(r => r.userId === userId)[0].status : REACTIONS_ENUM.None)
                    : REACTIONS_ENUM.None,
                newestLikes: [] as NewestLikeType[]

            }

        }

        if(result.extendedLikesInfo.likesCount){
            const newestLikes =  post.reactions.reduce((acc: NewestLikeType[] , r: StatusType):  NewestLikeType[] => {
                if(r.status === REACTIONS_ENUM.Like){
                    acc.push({
                        addedAt: r.createdAt.toISOString(),
                        userId: r.userId,
                        login: r.login,


                    } );
                }
                return acc
            }, [] as NewestLikeType[]).sort((a, b) => new Date(b.addedAt).getTime()  - new Date(a.addedAt).getTime())

            if(newestLikes.length > 3){
                result.extendedLikesInfo.newestLikes.push(newestLikes[0], newestLikes[1], newestLikes[2])
            } else {
                result.extendedLikesInfo.newestLikes.push(...newestLikes)
            }
        }

        return result;
    }
}