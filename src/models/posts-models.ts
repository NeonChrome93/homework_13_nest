import {WithId} from "mongodb";
import {REACTIONS_ENUM} from "./comments-models";



export type PostType = {

    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string
    reactions: []
}

export type NewestLikeType = {
    "addedAt": string,
    "userId": string,
    "login": string
}

export type PostViewType = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string,
    "extendedLikesInfo": {
        likesCount: number,
        dislikesCount: number,
        myStatus: REACTIONS_ENUM,
        newestLikes:  NewestLikeType[]
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