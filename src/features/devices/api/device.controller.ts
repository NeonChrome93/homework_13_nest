import {Controller, Delete, Get, HttpCode, Param, Req, Res, UnauthorizedException, UseGuards} from "@nestjs/common";
import {Request, Response} from 'express';
import {JwtAdapter} from "../../auth/adapters/jwt.adapter";
import {DevicesService} from "../application/device.service";
import {UserAll, UserId} from "../../../infrastructure/decorators/get-user.decorator";
import {User} from "../../users/domain/user.entity"
import {DevicesQueryRepository} from "../repositories/device.query.repository";
import {SkipThrottle, Throttle} from "@nestjs/throttler";
import {AuthSessionTokenGuard} from "../../../infrastructure/guards/auth-session-token.guard";
import {DeviceId} from "../../../infrastructure/decorators/get-device.decorator";
import {CommandBus} from "@nestjs/cqrs";
import {DeleteDeviceCommand, DeleteDeviceUseCase} from "../application/usecases/delete-device.usecase";
import {DeviceViewModel} from "./models/output";

@Controller('security/devices')
export class DeviceController {
    constructor(private readonly jwtService: JwtAdapter,
                private readonly devicesService: DevicesService,
                private readonly devicesQueryRepository: DevicesQueryRepository,
                private readonly commandBus: CommandBus) {
    }

    @Get()
    @UseGuards(AuthSessionTokenGuard)
    @HttpCode(200)
    async getDevices(@Req() req: Request, @UserId() userId: string): Promise<DeviceViewModel[]>{
        const devises: DeviceViewModel[] = await this.devicesQueryRepository.findAllUserDevices(userId)
        return devises

    }

    @Delete()
    @HttpCode(204)
    @UseGuards(AuthSessionTokenGuard)
    async deleteDevicesExcludeCurrent(@UserAll() user: User, @DeviceId() deviceId: string) :Promise<void> {
        //console.log(req.deviceId)
        await this.devicesService.deleteDeviceExpectCurrent(user!._id.toString(), deviceId!.toString())

    }

    @Delete(':deviceId')
    @UseGuards(AuthSessionTokenGuard)
    //@HttpCode(204)
    async deleteDeviceById(@Param('deviceId') deviceId: string, @UserAll() user: User, @Res() res: Response) {
        const status = await this.commandBus.execute(new DeleteDeviceCommand(deviceId, user!._id.toString()))
        return res.sendStatus(status)



        // If try to delete the deviceId of other user -найти девайс по девайс если его нет 404, вытащить юзер ид и сравнить юзер
        //ид у девайся с юзер ид в токене если они не равны кинуть 403
//-> deviceService-> deleteDeviceById
    }
}