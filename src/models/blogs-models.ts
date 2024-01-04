import {IsMongoId, IsNotEmpty, IsString, IsUrl, IsUUID, MaxLength} from "class-validator";
import {ObjectId} from "mongodb";
import {Trim} from "./custom";
import {IsBlogExist} from "../common/decorators/blog-exist.decorator";


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

export class CreateBlogDto
    {

        @MaxLength(15)
        @Trim()
        @IsString()
        @IsNotEmpty()
        "name": string

        @MaxLength(500)
        @Trim()
        @IsString()
        @IsNotEmpty()
        "description": string
        @IsUrl()
        @IsString()
        @IsNotEmpty()
        "websiteUrl": string
    }

    // export class CreateBlogDto
    // {
    //     @IsString()
    //     @MaxLength(100)
    //     name: string
    //     @IsString()
    //     description: string
    //     @IsString()
    //     @ArrayMinSize(1)
    //     websiteUrl: string
    // }

export class BlogIdDto {
    @IsMongoId()
    @IsBlogExist({message:'blog not exist'})
    blogId: string
}

export class UpdateBlogTypeDto
    {

        @MaxLength(15)
        @Trim()
        @IsString()
        @IsNotEmpty()
        name: string
        @MaxLength(500)
        @Trim()
        @IsString()
        @IsNotEmpty()
        description: string
        @IsUrl()
        @Trim()
        @IsString()
        @IsNotEmpty()
        websiteUrl: string
    }
