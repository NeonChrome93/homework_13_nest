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
    UseGuards,
    Headers
} from "@nestjs/common";
import {BearerAuthGuard} from "../../../infrastructure/guards/user.guard";
import {User, UserDocument} from "../../users/domain/user.entity";
import e, {Response} from 'express';
import {Request} from 'express';
import {AuthService} from "../application/auth.service";
import {UsersRepository} from "../../users/repositories/user.repository";
import {JwtAdapter} from "../adapters/jwt.adapter";
import {UserAll, UserId} from "../../../infrastructure/decorators/get-user.decorator";
import {DevicesService} from "../../devices/application/device.service";
import {DevicesRepository} from "../../devices/repositories/device.repository";
import {AuthSessionTokenGuard} from "../../../infrastructure/guards/auth-session-token.guard";
import {Throttle, ThrottlerGuard} from "@nestjs/throttler";
import {DeviceId} from "../../../infrastructure/decorators/get-device.decorator";
import {LocalAuthGuard} from "../../../infrastructure/guards/auth-local.guard";
import {UserCreateModelDto} from "../../users/api/models/input/user.input.model";
import {CommandBus} from "@nestjs/cqrs";
import {RegistrationUserCommand} from "../application/usecases/registration-user.usecase";
import {CodeDto, EmailDto, NewPasswordDto} from "./models/auth-input.models";
import {PasswordRecoveryCommand} from "../application/usecases/password-recovery.usecase";
import {NewPasswordSetCommand} from "../application/usecases/new-password-set.usecase";
import {ResendingCodeCommand} from "../application/usecases/resending-code.usecase";
import {ConfirmEmailCommand} from "../application/usecases/confirm-email.usecase";
import {AuthLoginCommand} from "../application/usecases/auth-login.usecase";


@Controller('auth')

export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly jwtService: JwtAdapter,
                private readonly usersRepository: UsersRepository,
                private readonly devicesService: DevicesService,
                private readonly devicesRepository: DevicesRepository,
                private readonly commandBus: CommandBus) {
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
     @UseGuards(ThrottlerGuard, LocalAuthGuard)
    @HttpCode(200)
        //@Throttle({default: {ttl: 10000, limit: 5}})
    async authLogin(@Res({passthrough: true}) res: Response, @UserAll() user: User, @Ip() ip: string, @Headers('user-agent') title: string) {
       // const {loginOrEmail, password} = req.body

        console.log(title)
        console.log('loginOrEmail')
        const result = await this.commandBus.execute(new AuthLoginCommand( ip, title || 'x', user)); // alt+ enter
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
        await this.commandBus.execute(new RegistrationUserCommand({
            login: dto.login,
            email: dto.email,
            password: dto.password,
            //message: req.body.message
        }))
        return

    }

    @Post('/registration-confirmation')
    //@Throttle({default: {ttl: 10000, limit: 5}})
    @UseGuards(ThrottlerGuard)
    @HttpCode(204)
    async confirmRegistration(@Body() codeDto: CodeDto) {
        const isConfirmed = await this.commandBus.execute(new ConfirmEmailCommand(codeDto.code));
        if (!isConfirmed) throw new BadRequestException()
        return isConfirmed
    }

    @Post('/password-recovery')
    @HttpCode(204)
    async passwordRecovery(@Body() emailDto: EmailDto) {
        const result = await this.commandBus.execute(new PasswordRecoveryCommand(emailDto.email));
        return result
    }

    @Post('/new-password')
    @HttpCode(204)
    async newPassword(@Body() newPasswordDto: NewPasswordDto) {
        const result = await this.commandBus.execute(new NewPasswordSetCommand(newPasswordDto.newPassword, newPasswordDto.recoveryCode));
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
        const receivedCode = await this.commandBus.execute(new ResendingCodeCommand(emailDto.email));
        if (!receivedCode) {
            throw new BadRequestException()
        } else return
//юзеру может не прийти код, сгенерировать новый,записать в базу,  переслать код еще раз по емайл новый код
    }


}