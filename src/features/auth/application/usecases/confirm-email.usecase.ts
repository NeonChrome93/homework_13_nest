import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../../../users/repositories/user.repository";

export class  ConfirmEmailCommand {
    constructor(public code: string) {
    }
}

//проверить подтверждение кода поле isComfirmed: true
@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase implements ICommandHandler<ConfirmEmailCommand> {
    constructor(private readonly usersRepository: UsersRepository) {
    }

    //подтверждение email
    async execute(command:ConfirmEmailCommand) : Promise<boolean>{
        const user = await this.usersRepository.readUserByCode(command.code)
        if (!user) return false;
        await this.usersRepository.confirmEmail(user._id.toString())
        return true

    }
}