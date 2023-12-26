import {Controller, Delete, Get, HttpCode, Param, Req, UnauthorizedException, UseGuards} from "@nestjs/common";
import {Request} from 'express';
import {JwtAdapter} from "../common/adapters/jwt.adapter";
import {DevicesService} from "./device.service";
import {UserAll, UserId} from "../common/decorators/get-user.decorator";
import {User} from "../users/user.entity"
import {DevicesQueryRepository} from "./device.query.repository";
import {checkRefreshToken, DeviceId} from "../guards/auth.guard";

@Controller('security')


export class DeviceController {
    constructor(private readonly jwtService: JwtAdapter,
                private readonly devicesService: DevicesService,
                private readonly devicesQueryRepository: DevicesQueryRepository) {
    }
    @Get('/devices')
    async getDevices(@Req() req: Request) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) throw new UnauthorizedException()
        const userId = this.jwtService.getUserIdByToken(refreshToken)
        const devises = await this.devicesQueryRepository.findAllUserDevices(userId)
        return devises

    }

    @Delete('/devices')
    @HttpCode(204)
    @UseGuards(checkRefreshToken)
    async deleteDevicesExcludeCurrent(@UserAll() user: User, @DeviceId() deviceId: string) {
        //console.log(req.deviceId)
        await this.devicesService.deleteDeviceExpectCurrent(user!._id.toString(), deviceId!.toString())
        return

    }

    @Delete(':deviceId')
    @UseGuards(checkRefreshToken)
    @HttpCode(204)
    async deleteDeviceById(@Param('deviceId') deviceId: string, @UserAll() user: User) {

        const status = await this.devicesService.deleteDevicesById(deviceId, user!._id.toString())
        return status

        // If try to delete the deviceId of other user -найти девайс по девайс если его нет 404, вытащить юзер ид и сравнить юзер
        //ид у девайся с юзер ид в токене если они не равны кинуть 403
//-> deviceService-> deleteDeviceById
    }
}