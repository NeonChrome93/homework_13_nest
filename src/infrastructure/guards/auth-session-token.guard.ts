import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtAdapter} from "../../features/auth/adapters/jwt.adapter";
import {UserService} from "../../features/users/user.service";
import {DevicesService} from "../../features/devices/device.service";
import {DevicesRepository} from "../../features/devices/device.repository";

@Injectable()
export class AuthSessionTokenGuard implements CanActivate {
    constructor(private readonly jwtService: JwtAdapter,
                private readonly userService: UserService,
                private readonly devicesService: DevicesService,
                private readonly devicesRepository: DevicesRepository,) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const refreshToken = request.cookies.refreshToken
        if (!refreshToken) {
            throw new UnauthorizedException();
        }


        const payload = await this.jwtService.getDeviceIdByToken(refreshToken);

        if (!payload) {
            throw new UnauthorizedException();
        }


        if (payload.userId && payload.deviceId) {
            request.user = await this.userService.findUserById(payload.userId.toString())
            if (!request.user) throw new UnauthorizedException();
            request.deviceId = payload.deviceId
        }


        //const existDevice = await this.devicesRepository.isDeviceExistByUserIdAndDeviceId(payload.deviceId, payload.userId)
        // if (!existDevice) {
        //}

        const device = await this.devicesService.findDeviceById(payload.deviceId);
        const tokenDate = this.jwtService.lastActiveDate(refreshToken)

        const tokenTime = new Date(tokenDate).getTime()

        if (device === null || device.lastActiveDate.getTime() !== tokenTime) {
            throw new UnauthorizedException();

        }

        return true
    }
}