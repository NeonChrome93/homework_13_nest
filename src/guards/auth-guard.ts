import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';

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
        } throw new UnauthorizedException()
    }
}