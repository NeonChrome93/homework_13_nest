import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import {UsersRepository} from "../../users/user.repository";
import {Injectable} from "@nestjs/common";
@Injectable()
@ValidatorConstraint({ async: true })
export class RegistrationConfirmCode implements ValidatorConstraintInterface {
    constructor(private readonly userRepository: UsersRepository) {
    }
    async validate(code: string, args: ValidationArguments) {
        const user = await this.userRepository.readUserByCode(code);
        if (!user) {
            return false
        }
        if (user.isConfirmed) {
            return false
        }
        return true;
    }

}

export function IfCodeExist (validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IfCodeExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: RegistrationConfirmCode ,
        });
    };
}

// body('code').custom(async (code: string) => {
//     const user = await usersRepository.readUserByCode(code)
//     if(!user) throw new Error("user not exist")
//     if(user.isConfirmed) throw new Error("user already confirmed")
//     return true
// })