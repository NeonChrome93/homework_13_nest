import bcrypt from "bcrypt";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../../../users/repositories/user.repository";

export class NewPasswordSetCommand {
    constructor(public newPassword: string, public recoveryCode: string) {
    }
}

@CommandHandler(NewPasswordSetCommand)
export class NewPasswordSetUseCase implements ICommandHandler<NewPasswordSetCommand>{
    constructor(private readonly usersRepository: UsersRepository ) {
    }

    //установка нового пароля
    async execute(command:NewPasswordSetCommand) :Promise<boolean>  {
        const user = await this.usersRepository.findUserByRecoveryCode(command.recoveryCode)
        if(!user) return false

        if(!command.newPassword || !user.expirationDateOfRecoveryCode || user.expirationDateOfRecoveryCode < new Date()) return false


        user.passwordHash = await bcrypt.hash(command.newPassword, user.passwordSalt)
        user.passwordRecoveryCode = null
        user.expirationDateOfRecoveryCode = null

        await this.usersRepository.saveUser(user)
        return true
    }
}