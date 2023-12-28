import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import {UsersRepository} from "../../users/user.repository";
import {Injectable} from "@nestjs/common";
import {BlogRepository} from "../../blogs/blog.repository";
@Injectable()
@ValidatorConstraint({ async: true })
export class IsBlogExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly blogRepository: BlogRepository) {
    }
    validate(blogId: any, args: ValidationArguments) {
        return this.blogRepository.readBlogsId(blogId).then(blog => {
            if (blog) return false;
            return true;
        });
    }
}

export function IsBlogExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsUserAlreadyExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBlogExist,
        });
    };
}