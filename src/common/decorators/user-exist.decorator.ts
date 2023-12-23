import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import {UsersRepository} from "../../users/user.repository";
import {Injectable} from "@nestjs/common";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly UserRepository: UsersRepository) {
    }
    validate(userName: any, args: ValidationArguments) {
        return this.UserRepository.findByLoginOrEmail(userName).then(user => {
            if (user) return false;
            return true;
        });
    }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint,
        });
    };
}