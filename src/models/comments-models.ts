import {IsEnum, IsIn, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {Trim} from "./custom";


export class UpdateCommentDto {

    @MaxLength(300)
    @MinLength(20)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string
}



export enum REACTIONS_ENUM {
    Like = "Like",
    Dislike = "Dislike",
    None = "None"
}

export class updateLikeDto{
    @IsIn(Object.values(REACTIONS_ENUM))
    likeStatus: REACTIONS_ENUM

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