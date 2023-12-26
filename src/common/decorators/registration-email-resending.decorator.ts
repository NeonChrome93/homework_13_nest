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
@ValidatorConstraint({async: true})
export class RegistrationEmailResendingConstraint implements ValidatorConstraintInterface {
    constructor(private readonly userRepository: UsersRepository) {
    }

    async validate(email: string, args: ValidationArguments) {
        const user = await this.userRepository.readUserByEmail(email);
        if (!user) {
            return false
        }
        if (user.isConfirmed) {
            return false
        }
        return true;
    }

}

export function IfUserExistOrConfirmed(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IfUserExistOrConfirmed',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: RegistrationEmailResendingConstraint,
        });
    };
}


// body('email').custom(async (email: string)=> {
//     const user = await usersRepository.readUserByEmail(email)
//     if(!user) throw new Error("user not exist")
//     if(user.isConfirmed) throw new Error("user already confirmed")
//     return true
//
// }),