import {IfCodeExist} from "../../../../../infrastructure/decorators/registration-conformation.decorator";
import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {IfUserExistOrConfirmed} from "../../../../../infrastructure/decorators/registration-email-resending.decorator";
import {Trim} from "../../../../../models/custom";

export class CodeDto  {
    @IfCodeExist({
        message: 'user with this code not exist or already confirmed'})
    @IsString()
    @IsNotEmpty()
    code: string
}

export class EmailDto  {
    @IfUserExistOrConfirmed({
        message: 'user with this email not exist or already confirmed'})
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