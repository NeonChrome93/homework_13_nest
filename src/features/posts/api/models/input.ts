import {IsEnum, IsNotEmpty, IsString, MaxLength} from "class-validator";
import {Trim} from "../../../../models/custom";
import {IsBlogExist} from "../../../../infrastructure/decorators/blog-exist.decorator";
import {REACTIONS_ENUM} from "../../../../models/comments-models";

export class createPostDto {

    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    title: string

    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    shortDescription: string

    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string
    @IsBlogExist({message:'blog not found'})
    @Trim()
    @IsString()
    @IsNotEmpty()
    blogId: string
}

export class createPostByBlogIdDto {

    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    title: string

    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    shortDescription: string

    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string

}


export class UpdatePostDto {
    @MaxLength(30)
    @Trim()
    @IsString()
    @IsNotEmpty()
    title: string
    @MaxLength(100)
    @Trim()
    @IsString()
    @IsNotEmpty()
    shortDescription: string
    @MaxLength(1000)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string
    @IsBlogExist({message: "blog not found"})
    @Trim()
    @IsString()
    @IsNotEmpty()
    blogId: string
}

export class likesDto {
    @IsEnum(REACTIONS_ENUM)
    likeStatus: REACTIONS_ENUM
}