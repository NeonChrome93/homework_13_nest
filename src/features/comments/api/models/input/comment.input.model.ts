import {IsIn, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {Trim} from "../../../../../models/custom";
import {REACTIONS_ENUM} from "../output/comments.output.models";


export class UpdateCommentDto {

    @MaxLength(300)
    @MinLength(20)
    @Trim()
    @IsString()
    @IsNotEmpty()
    content: string
}

export class updateLikeDto{
    @IsIn(Object.values(REACTIONS_ENUM))
    likeStatus: REACTIONS_ENUM

}