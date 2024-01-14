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
import {BearerAuthGuard} from "../infrastructure/guards/user-guard";
import {User, UserDocument} from "../features/users/user.entity";
import e, {Response} from 'express';
import {Request} from 'express';
import {AuthService} from "./auth.service";
import {UsersRepository} from "../features/users/user.repository";
import {JwtAdapter} from "../common/adapters/jwt.adapter";
import {UserAll, UserId} from "../infrastructure/decorators/get-user.decorator";
import {DevicesService} from "../features/devices/device.service";
import {DevicesQueryRepository} from "../features/devices/device.query.repository";
import {DevicesRepository} from "../features/devices/device.repository";
import {CodeDto, EmailDto,  NewPasswordDto, UserCreateModelDto} from "../models/users-models";
import {AuthSessionTokenGuard} from "../infrastructure/guards/auth-session-token.guard";
import {Throttle, ThrottlerGuard} from "@nestjs/throttler";
import {DeviceId} from "../infrastructure/decorators/get-device.decorator";


@Controller('auth')

export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly jwtService: JwtAdapter,
                private readonly usersRepository: UsersRepository,
                private readonly devicesService: DevicesService,
                private readonly devicesRepository: DevicesRepository) {
    }

    @Get('/me')
    @UseGuards(BearerAuthGuard)
    async getUserCredentials(@UserAll() user: User) {
        console.log(user)
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    }

    @Post('/login')//отдельный юз кейс на каждый запрос
     @UseGuards(ThrottlerGuard)
    @HttpCode(200)
        //@Throttle({default: {ttl: 10000, limit: 5}})
    async authLogin(@Res({passthrough: true}) res: Response, @Req() req: Request, @Ip() ip: string) {
        const {loginOrEmail, password} = req.body
        console.log('loginOrEmail', loginOrEmail, password)
        const result = await this.authService.login(loginOrEmail, password, ip, req.headers['user-agent'] || 'x') // alt+ enter
        if (!result) return res.sendStatus(401)
        res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})

        return {accessToken: result.accessToken}
    }


    @Post('/refresh-token')
   @UseGuards(AuthSessionTokenGuard)


    async refreshToken(
        @Res() res: Response,
        @Req() req: Request,
        @UserAll() user: User
    ) {
        console.log('in refresh')
        const refreshToken = req.cookies.refreshToken
        console.log(refreshToken)

        // const device = await findDeviceById(payload.deviceId)
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
    @UseGuards(AuthSessionTokenGuard)
    async authLogout(@Res() res: Response, @Req() req: Request, @DeviceId() deviceId: string) {
        try {

            const refreshToken = req.cookies.refreshToken


            //добавить миддлвару на наличие токена

            if (refreshToken) {

                await this.devicesRepository.deleteDevicesById(deviceId!.toString())

                //достать device из БД и сравнить lastActiveDate из БД и из текущего токена
                //delete device by deviceId
                //в чс уже не помещает, выйти с текущего устройства
                return res.sendStatus(204)
            } else {
                throw new UnauthorizedException()
            }
        }
        catch (err) {
            console.log(err)}
    }

    @Post('/registration')
    //@Throttle({default: {ttl: 10000, limit: 5}})
    @UseGuards(ThrottlerGuard)
    @HttpCode(204)
    async registrationUser(@Body() dto: UserCreateModelDto) {
        await this.authService.registrationUser({
            login: dto.login,
            email: dto.email,
            password: dto.password,
            //message: req.body.message
        })
        return

    }

    @Post('/registration-confirmation')
    //@Throttle({default: {ttl: 10000, limit: 5}})
    @UseGuards(ThrottlerGuard)
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
    async newPassword(@Body() newPasswordDto: NewPasswordDto) {
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
    //@Throttle({default: {ttl: 10000, limit: 5}})
    @UseGuards(ThrottlerGuard)
    async receivedCode(@Body() emailDto: EmailDto) {
        const receivedСode = await this.authService.resendingCode(emailDto.email)
        if (!receivedСode) {
            throw new BadRequestException()
        } else return
//юзеру может не прийти код, сгенерировать новый,записать в базу,  переслать код еще раз по емайл новый код
    }


}