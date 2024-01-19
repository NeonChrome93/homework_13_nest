import {IsMongoId, IsNotEmpty, IsString, IsUrl, MaxLength} from "class-validator";
import {Trim} from "../../../../../models/custom";
import {IsBlogExist} from "../../../../../infrastructure/decorators/blog-exist.decorator";


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
