import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {CommandBus} from "@nestjs/cqrs";
import {UserService} from "../../users/application/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService,
                ) {
        super({
            usernameField:'loginOrEmail'
        });
    }

    async validate(loginOrEmail: string, password: string): Promise<any> {
        console.log('credentials', loginOrEmail, password)
        const user = await this.userService.checkCredentials(loginOrEmail, password);
        console.log('user', user)
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}