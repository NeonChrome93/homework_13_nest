import {CanActivate, createParamDecorator, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../users/user.service";
import * as jwt from 'jsonwebtoken';
import {JwtServices} from "../common/adapters/jwt.service";




@Injectable()
export class  authMiddleware implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtServices ) {
  }

  async  canActivate(
        context: ExecutionContext,
    ): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            throw new UnauthorizedException()
        }

        const token = request.headers.authorization.split(' ')[1];
        const userId = this.jwtService.getUserIdByToken(token)
        console.log(token)

        if (userId) {
            const user = await this.userService.findUserById(userId.toString()).then(user => {
                request.user =  user ? user : null;
            })
            return true
        }
         else  throw new UnauthorizedException()
    }

}

@Injectable()
export class  softAuthMiddleware implements CanActivate {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtServices ) {
    }

    async  canActivate(
        context: ExecutionContext,
    ): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            request.user = null
        }

        const token = request.headers.authorization.split(' ')[1];
        const userId = this.jwtService.getUserIdByToken(token)
        console.log(token)

        if (userId) {
            const user = await this.userService.findUserById(userId.toString()).then(user => {
                request.user =  user ? user : null;
            })
            return true
        }
       else request.user = null
        return true
    }

}
