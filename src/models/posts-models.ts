import {WithId} from "mongodb";
import {REACTIONS_ENUM} from "./comments-models";
import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {Trim} from "./custom";


export type PostType = {

    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string
    // reactions: []
}

export type PostsQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string | null
}

export type NewestLikeType = {
    "addedAt": string,
    "userId": string,
    "login": string
}

export class PostViewType {
    constructor(

   public id: string,
   public title: string,
   public shortDescription: string,
   public content: string,
   public blogId: string,
   public blogName: string,
   public createdAt: string,
   public extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: REACTIONS_ENUM,
        newestLikes: NewestLikeType[] }) {

    }
}

export type mongoTypePost = WithId<PostType>

export class createPostDto {

    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    "title": string

    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    "shortDescription": string

    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    "content": string
    @Trim()
    @IsString()
    @IsNotEmpty()
    "blogId": string
}


export class UpdatePostDto {
    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    "title": string
    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    "shortDescription": string
    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    "content": string
    @Trim()
    @IsString()
    @IsNotEmpty()
    "blogId": string
}

