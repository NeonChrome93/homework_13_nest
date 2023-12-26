import {ObjectId} from "mongoose";
import {IsUserAlreadyExist} from "../common/decorators/user-exist.decorator";
import {isEmail, IsEmail, IsNotEmpty, IsString, IsUrl, MaxLength, MinLength} from "class-validator";
import {Trim} from "./custom";

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



export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UsersQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string | null
}


export class codeDto  {
    @IsString()
    @IsNotEmpty()
    code: string
}

export class emailDto  {
    @IsEmail( )
    @IsString()
    @IsNotEmpty()
    email: string
}

export class NewPasswordDto {
    @MaxLength(20)
    @MinLength(6)
    @Trim()
    @IsString()
    @IsNotEmpty()
    newPassword: string
    @IsString()
    @IsNotEmpty()
    recoveryCode: string
}