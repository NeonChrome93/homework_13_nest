import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const UserAll = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);


export const UserId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (request.user) return request.user._id.toString()
        return null;
    },
);