import {ArrayMinSize, IsString, MaxLength} from "class-validator";
import {ObjectId} from "mongodb";

export class Blog {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean) {

    }
}



export class BlogsViewType {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership : Boolean
    ) {
    }
}

//export type mongoType = WithId<BlogsType>

export type BlogsQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string | null
}

export type CreateBlogType =
    {
        "name": string,
        "description": string,
        "websiteUrl": string
    }

    export class CreateBlogDto
    {
        @IsString()
        @MaxLength(100)
        name: string
        @IsString()
        description: string
        @IsString()
        @ArrayMinSize(1)
        websiteUrl: string
    }


export class UpdateBlogType
    {
        "name": string
        "description": string
        "websiteUrl": string
    }
