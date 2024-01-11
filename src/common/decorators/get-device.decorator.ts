import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const DeviceId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.deviceId;
    })