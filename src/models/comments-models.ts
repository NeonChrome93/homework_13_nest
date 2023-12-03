export type CreateCommentType = {
    content: string
}

export type UpdateCommentType = {
    content: string
}

export enum REACTIONS_ENUM {
    Like = "Like",
    Dislike = "Dislike",
    None = "None"
}

export type CommentsViewType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: REACTIONS_ENUM
    }
}