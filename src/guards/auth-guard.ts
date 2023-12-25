import {Injectable, CanActivate, ExecutionContext, UnauthorizedException, createParamDecorator} from '@nestjs/common';
import {Observable} from 'rxjs';
import {UserService} from "../users/user.service";
import {JwtServices} from "../common/adapters/jwt.service";

const users = {
    login: 'admin',
    password: 'qwerty'
}


@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // res.send(shops)
        //console.log('header', req.headers)
        //взять auth и сделать гард
        const encode = Buffer.from(`${users.login}:${users.password}`, "utf-8").toString("base64")
        //console.log(encode)
        if (request.headers.authorization === `Basic ${encode}`) {
            return true
        }
        throw new UnauthorizedException()
    }
}


export const DeviceId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.deviceId;
    },
);


@Injectable()
export class checkRefreshToken implements CanActivate {
    constructor(private readonly jwtService: JwtServices,
                private readonly userService: UserService,) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const refreshToken = request.cookies.refreshToken
        if (!refreshToken) {
            throw new UnauthorizedException()

        }

        try {


            const payload = await this.jwtService.getDeviceIdByToken(refreshToken)

            if (payload.userId && payload.deviceId) {
                request.user = await this.userService.findUserById(payload.userId.toString())
                request.deviceId = payload.deviceId
            }
        } catch (error) {
            throw new UnauthorizedException()
        }
        return true
    }
}