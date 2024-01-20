import {ObjectId} from "mongodb";
import {User} from "../../users/domain/user.entity";
import {randomUUID} from "crypto";
import {UserService} from "../../users/application/user.service";
import {Injectable, UseGuards} from "@nestjs/common";
import {JwtAdapter} from "../adapters/jwt.adapter";
import {EmailAdapter} from "../adapters/email.adapter";
import {UsersRepository} from "../../users/repositories/user.repository";
import {add} from "date-fns"
import bcrypt from "bcrypt";
import {DevicesService} from "../../devices/application/device.service";
import {DevicesRepository} from "../../devices/repositories/device.repository";
import {ThrottlerGuard} from "@nestjs/throttler";
import {UserCreateModelDto} from "../../users/api/models/input/user.input.model";
import {UserViewModel} from "../../users/api/models/output/user.output.model";
import {CommandBus} from "@nestjs/cqrs";
import {CreateDeviceCommand, CreateDeviceUseCase} from "../../devices/application/usecases/create-device.usecase";


@Injectable()
export class AuthService  {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtAdapter,
                private readonly emailService: EmailAdapter,
                private readonly deviceService: DevicesService,
                private readonly deviceRepository: DevicesRepository,
                private readonly usersRepository: UsersRepository,
                private readonly commandBus: CommandBus) {
    }


    //подтверждение email
    async confirmEmail(code: string) {
        const user = await this.usersRepository.readUserByCode(code)
        if (!user) return false;
        await this.usersRepository.confirmEmail(user._id.toString())
        return true

    }

    async resendingCode(email: string): Promise<boolean> {
        const user = await this.usersRepository.readUserByEmail(email)
        if (!user) return false;
        const newCode = randomUUID()
        await this.usersRepository.updateConfirmationCode(user._id.toString(), newCode);
        try {
            this.emailService.sendEmail(user.email, newCode, 'It is your code');
        } catch (e) {
            console.log("code resending email error", e);
        }

        return true

    }

    async passwordRecovery(email: string): Promise<boolean> {
        const user = await this.usersRepository.readUserByEmail(email)
        if (!user) return false;

        user.passwordRecoveryCode =  randomUUID();
        user.expirationDateOfRecoveryCode = add(new Date(), {
            hours: 1,
            minutes: 3
        });

        await this.usersRepository.saveUser(user);

        try {
            this.emailService.resendEmail(email, user.passwordRecoveryCode)
        } catch (e) {
            console.log("code resending email error", e);
        }

        return true

    }

    async newPasswordSet(newPassword: string, recoveryCode: string) :Promise<boolean>  {
        const user = await this.usersRepository.findUserByRecoveryCode(recoveryCode)
        if(!user) return false

        if(user.expirationDateOfRecoveryCode && user.expirationDateOfRecoveryCode < new Date()) return false

        user.passwordHash = await bcrypt.hash(newPassword, user.passwordSalt)
        user.passwordRecoveryCode = null
        user.expirationDateOfRecoveryCode = null

        await this.usersRepository.saveUser(user)

        return true

    }


    async login( ip: string, title: string, user: User): Promise<{ accessToken: string, refreshToken: string } | null> {
        //const user = await this.userService.checkCredentials(loginOrEmail, password)
        console.log('service', user)
       // if (!user) return null
        const accessToken = this.jwtService.createJWT(user);
        const deviceId = randomUUID()
        const refreshToken = this.jwtService.generateRefreshToken(user, deviceId);
        const lastActiveDate = this.jwtService.lastActiveDate(refreshToken)// взять дату выписки этого токена === lastActiveDate у девайся
        await this.commandBus.execute(new CreateDeviceCommand(ip, deviceId, user._id.toString(), title, new Date(lastActiveDate)))
        return {
            accessToken,
            refreshToken
        }
    }

    async refresh(user: User, refreshToken: string): Promise<{ accessToken: string, newRefreshToken: string } | null> {
        const payload = this.jwtService.getDeviceIdByToken(refreshToken)
        const accessToken = this.jwtService.createJWT(user);
        const newRefreshToken = this.jwtService.generateRefreshToken(user, payload.deviceId);
        const lastActiveDate = this.jwtService.lastActiveDate(newRefreshToken);
       await this.deviceRepository.updateDeviceLastActiveDate(payload.deviceId, lastActiveDate)
        return {
            accessToken,
            newRefreshToken
        }
    }
}