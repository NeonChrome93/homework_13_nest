import {CanActivate, createParamDecorator, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../users/user.service";
import * as jwt from 'jsonwebtoken';


export const UserAll = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);


export const UserId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user.userId;
    },
);


export class  authMiddleware implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService ) {
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
        //console.log(token)

        if (userId) {
            const user = await this.userService.findUserById(userId.toString()).then(user => {
                request.user = {userId: user ? user._id.toString() : null};
            })
            return true
        }
         else  throw new UnauthorizedException()
    }

}

@Injectable()
export class JwtService {
    private readonly secretKey = 'your-secret-key'; // Замените "your-secret-key" на ваш секретный ключ

    generateToken(payload: any): string {
        return jwt.sign(payload, this.secretKey);
    }

    verifyToken(token: string): any {
        return jwt.verify(token, this.secretKey);
    }

    getUserIdByToken(token: string): string {
        const payload: any = this.verifyToken(token);
        return payload.userId;
    }
}