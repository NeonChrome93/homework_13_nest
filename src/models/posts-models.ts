import {WithId} from "mongodb";
import {REACTIONS_ENUM} from "./comments-models";


export type PostType = {

    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string
    // reactions: []
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

export type createPostType = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string
}


export type UpdatePostType = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
}

export type PostsQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string | null
}