import {IsUserAlreadyExist} from "../../../../../infrastructure/decorators/user-exist.decorator";
import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {Trim} from "../../../../../models/custom";

export class UserCreateModelDto {
    @IsUserAlreadyExist({
        message: 'User already exists. Choose another name.'})
    @MaxLength(10)
    @MinLength(3)
    @Trim()
    @IsString()
    @IsNotEmpty()
    login: string
    @IsUserAlreadyExist()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string
    @MaxLength(20)
    @MinLength(6)
    @Trim()
    @IsString()
    @IsNotEmpty()
    password: string
}

export type UsersQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string | null
}