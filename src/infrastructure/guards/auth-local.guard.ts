import {Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    // handleRequest(err, user, info) {
    //     // Пользователь не найден или неверные учетные данные
    //     if (err || !user) {
    //         throw err || new UnauthorizedException();
    //     }
    //     // Успешная аутентификация
    //     return user;
    // }
 }