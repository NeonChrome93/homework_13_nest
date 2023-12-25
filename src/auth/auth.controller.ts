import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Ip,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards
} from "@nestjs/common";
import {authMiddleware} from "../guards/user-guard";
import {User, UserDocument} from "../users/user.entity";
import e, {Response} from 'express';
import {Request} from 'express';
import {AuthService} from "./auth.service";
import {UsersRepository} from "../users/user.repository";
import {JwtServices} from "../common/adapters/jwt.service";
import {checkRefreshToken, DeviceId} from "../guards/auth-guard";
import {UserAll, UserId} from "../common/decorators/get-user.decorator";
import {DevicesService} from "../devices/device.service";
import {DevicesQueryRepository} from "../devices/device.query.repository";
import {DevicesRepository} from "../devices/device.repository";
import {CodeDto, EmailDto,  newPasswordDto, UserCreateModel} from "../models/users-models";


@Controller('auth')

export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly jwtService: JwtServices,
                private readonly usersRepository: UsersRepository,
                private readonly devicesService: DevicesService,
                private readonly devicesRepository: DevicesRepository) {
    }

    @Get('/me')
    @UseGuards(authMiddleware)
    async getUserCredentials(@UserAll() user: User) {
        console.log(user)
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    }

    @Post('/login')
    async authLogin(@Res() res: Response, @Req() req: Request, @Ip() ip: string) {
        const {loginOrEmail, password} = req.body
        console.log('loginOrEmail', loginOrEmail, password)
        const result = await this.authService.login(loginOrEmail, password, ip, req.headers['user-agent'] || 'x') // alt+ enter
        if (!result) return res.sendStatus(401)
        return res
            .cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: result.accessToken})
    }


    @Post('/refresh-token')
    @UseGuards(checkRefreshToken)

    async refreshToken(
        @Res() res: Response,
        @Req() req: Request,
        @UserId() userId: string
    ) {
        const refreshToken = req.cookies.refreshToken
        //добавить миддлвару на наличие токена
        if (!refreshToken) {
            return res.sendStatus(401)
        }
        // Генерация новых токенов на основе переданных данных, например, идентификатора пользователя
        const user = await this.usersRepository.readUserById(userId)
        if (!user) return res.sendStatus(401)

        //const device = await findDeviceById(payload.deviceId)
        // if(device.lastActiveDate !== payload.lastActiveDate) return res.sendStatus(401)
        const result = await this.authService.refresh(user, refreshToken)
        if (!result) return res.sendStatus(401)
        return res
            .cookie('refreshToken', result.newRefreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: result.accessToken})
    }

    @Post('/logout')
    @HttpCode(200)
    @UseGuards(checkRefreshToken)
    async authLogout(@Res() res: Response, @Req() req: Request, @DeviceId() deviceId: string) {
        const refreshToken = req.cookies.refreshToken

        //добавить миддлвару на наличие токена

        if (refreshToken) {
            const lastActiveDate = this.jwtService.lastActiveDate(refreshToken)
            const device = await this.devicesService.findDeviceById(deviceId!.toString())
            if (!device) return res.sendStatus(401)
            if (device.lastActiveDate !== new Date(lastActiveDate)) return res.sendStatus(401)
            await this.devicesRepository.deleteDevicesById(deviceId!.toString())
            //достать device из БД и сравнить lastActiveDate из БД и из текущего токена
            //delete device by deviceId
            //в чс уже не помещает, выйти с текущего устройства
            return
        } else {
            throw new UnauthorizedException()
        }

    }

    @Post('/registration')
    @HttpCode(204)
    async registrationUser(@Body() dto: UserCreateModel) {
        await this.authService.registrationUser({
            login: dto.login,
            email: dto.email,
            password: dto.password,
            //message: req.body.message
        })
        return

    }

    @Post('/registration-confirmation')
    @HttpCode(204)
    async confirmRegistration(@Body() codeDto: CodeDto) {
        const isConfirmed = await this.authService.confirmEmail(codeDto.code)
        if (!isConfirmed) throw new BadRequestException()
        return isConfirmed
    }

    @Post('/password-recovery')
    @HttpCode(204)
    async passwordRecovery(@Body() emailDto: EmailDto) {
        const result = await this.authService.passwordRecovery(emailDto.email)
        return result
    }

    @Post('/new-password')
    @HttpCode(204)
    async newPassword(@Body() newPasswordDto: newPasswordDto) {
        const result = await this.authService.newPasswordSet(newPasswordDto.newPassword, newPasswordDto.recoveryCode)
        //0. валидация req.body
        //1. найти юзера по recoveryCode(если юзера нет в бд, кинуть ошибку)
        //2. поменять пароль юзера на новый
        //3. сохранить юзера в бд
        if (!result) {
            throw new BadRequestException()
        } else return result
    }


    @Post('/registration-email-resending')
    @HttpCode(204)
    async receivedCode(@Body() emailDto: EmailDto) {
        const receivedСode = await this.authService.resendingCode(emailDto.email)
        if (!receivedСode) {
            throw new BadRequestException()
        } else return
//юзеру может не прийти код, сгенерировать новый,записать в базу,  переслать код еще раз по емайл новый код
    }


}