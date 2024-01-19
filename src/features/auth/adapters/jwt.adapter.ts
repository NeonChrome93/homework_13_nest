import jwt, {JwtPayload} from 'jsonwebtoken'
import {User} from "../../users/domain/user.entity";
import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";


@Injectable()
export class JwtAdapter {
    // constructor(private readonly jwtService: JwtService)



    createJWT(user: User) {
        //TODO: 10s
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET || '123', {expiresIn: process.env.ACCESS_TIME})
        return token
    }

    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123' );
            return result.userId

        } catch (error) {
            return null
        }
    }

    //jwt.decode - можно достать дату выдачи и сохранить в БД + добавить переменную девайс ID
    generateRefreshToken(user: User, deviceId: string) { //deviceId
        return jwt.sign({userId: user._id, deviceId: deviceId}, process.env.JWT_SECRET || '123', {
            expiresIn: process.env.REFRESH_TIME,
        });

    }

    getDeviceIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123')
            return result //==={userId: user._id, deviceId: deviceId}


        } catch (error) {
            return null
        }
    }




    lastActiveDate(token: string): string {
        const result: any = jwt.decode(token)
        return new Date(result.iat * 1000).toISOString()//милесекунды и в строку
        //дата выписки токена это мое последнее посещение, закинуть в девайс репу

    }

    //создать токен с настройками и вернуть токен в куку createCookieToken +
}
