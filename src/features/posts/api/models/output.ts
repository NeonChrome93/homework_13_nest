import {REACTIONS_ENUM} from "../../../../models/comments-models";
import {WithId} from "mongodb";
import {PostType} from "../../../../models/posts-models";

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