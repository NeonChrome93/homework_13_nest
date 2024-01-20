import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {User} from "../../../users/domain/user.entity";
import {randomUUID} from "crypto";
import {CreateDeviceCommand} from "../../../devices/application/usecases/create-device.usecase";
import {JwtAdapter} from "../../adapters/jwt.adapter";

export class  AuthLoginCommand {
    constructor(public ip: string, public title: string, public user: User) {
    }
}

@CommandHandler(AuthLoginCommand)
export class AuthLoginUseCase implements ICommandHandler<AuthLoginCommand>{
    constructor(private readonly jwtService: JwtAdapter,
                private readonly commandBus: CommandBus) {
    }

    //вход в систему, пользователь логинится получает токены
    async execute(command:AuthLoginCommand): Promise<{ accessToken: string, refreshToken: string } | null> {
        //const user = await this.userService.checkCredentials(loginOrEmail, password)
        console.log('service', command.user)
        // if (!user) return null
        const accessToken = this.jwtService.createJWT(command.user);
        const deviceId = randomUUID()
        const refreshToken = this.jwtService.generateRefreshToken(command.user, deviceId);
        const lastActiveDate = this.jwtService.lastActiveDate(refreshToken)// взять дату выписки этого токена === lastActiveDate у девайся
        await this.commandBus.execute(new CreateDeviceCommand(command.ip, deviceId, command.user._id.toString(), command.title, new Date(lastActiveDate)))
        return {
            accessToken,
            refreshToken
        }
    }

}