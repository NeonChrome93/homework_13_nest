import {
    CanActivate,
    createParamDecorator,
    ExecutionContext, ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {UserService} from "../features/users/user.service";
import * as jwt from 'jsonwebtoken';
import {JwtAdapter} from "../common/adapters/jwt.adapter";
import {CommentsQueryRepository} from "../features/comments/comment.query.repository";
import {log} from "util";




@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtAdapter ) {
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
        console.log(token,'Auth token')

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
export class SoftBearerAuthGuard implements CanActivate {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtAdapter ) {
    }

    async  canActivate(
        context: ExecutionContext,
    ): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            request.user = null
            return true
        }

        const token = request.headers.authorization.split(' ')[1];
        const userId = this.jwtService.getUserIdByToken(token)
        console.log(userId)

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
