

export class CreateCommentDto  {
    content: string
}

export class UpdateCommentType  {
    content: string
}

export enum REACTIONS_ENUM {
    Like = "Like",
    Dislike = "Dislike",
    None = "None"
}

export class updateLikeDto{
    status: REACTIONS_ENUM

}

export class CommentsViewType {
    constructor(
        public id: string,
    public content: string,
    public commentatorInfo: {
         userId: string,
         userLogin: string
    },
    public createdAt: string,
    public likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: REACTIONS_ENUM

    }) {}
}