
import {ObjectId} from "mongodb";
import { UserCreateModel, UserViewModel} from "../models/users-models";
import {User} from "../users/user.entity";
import {randomUUID} from "crypto";
import {UserService} from "../users/user.service";

import {Injectable} from "@nestjs/common";
import {JwtServices} from "../common/adapters/jwt.service";
import {EmailService} from "../common/adapters/email.service";
import {UsersRepository} from "../users/user.repository";
import {add} from "date-fns"
import bcrypt from "bcrypt";
import {DevicesService} from "../devices/device.service";
import {DevicesRepository} from "../devices/device.repository";


@Injectable()
export class AuthService  {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtServices,
                private readonly emailService: EmailService,
                private readonly deviceService: DevicesService,
                private readonly deviceRepository: DevicesRepository,
                private readonly usersRepository: UsersRepository) {
    }

    async registrationUser(userCreateModel: UserCreateModel ): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(userCreateModel.password, passwordSalt)

        const newUser: User = {
            _id: new ObjectId(),
            login: userCreateModel.login, //valitation not copy in database
            email: userCreateModel.email, //
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date(),
            confirmationCode: randomUUID(), //generate code UUID //
            isConfirmed: false, // by registration
            expirationDateOfRecoveryCode: null,
            passwordRecoveryCode: null
        }
        await this.usersRepository.createUser(newUser);
        try {
            this.emailService.sendEmail(newUser.email, newUser.confirmationCode, 'It is your code')
        } catch (e) {
            console.log('registration user email error', e);
        }
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString()
        }
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


    async login(loginOrEmail: string, password: string, ip: string, title: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user = await this.userService.checkCredentials(loginOrEmail, password)
        console.log('user', user)
        if (!user) return null
        const accessToken = this.jwtService.createJWT(user);
        const deviceId = randomUUID()
        const refreshToken = this.jwtService.generateRefreshToken(user, deviceId);
        const lastActiveDate = this.jwtService.lastActiveDate(refreshToken)// взять дату выписки этого токена === lastActiveDate у девайся
        //await this.deviceService.createDevice(ip, deviceId, user._id.toString(), title, new Date(lastActiveDate))
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
       // await this.deviceRepository.updateDeviceLastActiveDate(payload.deviceId, lastActiveDate)
        return {
            accessToken,
            newRefreshToken
        }
    }
}