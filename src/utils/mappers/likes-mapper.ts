import {postDbType, StatusType} from "../../posts/post.entity";
import {REACTIONS_ENUM} from "../../models/comments-models";
import {NewestLikeType} from "../../models/posts-models";


export function likesMapper(p: postDbType, userId?: string | null) {
    const result = {
        id: p._id.toString(),
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt.toISOString(),
        extendedLikesInfo: {
            likesCount: p.reactions.filter(r => r.status === REACTIONS_ENUM.Like).length,
            dislikesCount: p.reactions.filter(r => r.status === REACTIONS_ENUM.Dislike).length,
            myStatus: userId ?
                (p.reactions.filter(r => r.userId === userId).length ? p.reactions.filter(r => r.userId === userId)[0].status : REACTIONS_ENUM.None)
                : REACTIONS_ENUM.None,
            newestLikes: [] as NewestLikeType[]
        }

    }

    if(result.extendedLikesInfo.likesCount){
        const newestLikes =  p.reactions.reduce((acc: NewestLikeType[] , r: StatusType):  NewestLikeType[] => {
            if(r.status === REACTIONS_ENUM.Like){
                acc.push({
                    addedAt: r.createdAt.toISOString(),
                    userId: r.userId,
                    login: r.login

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