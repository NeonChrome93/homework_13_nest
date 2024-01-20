import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {randomUUID} from "crypto";
import {UsersRepository} from "../../../users/repositories/user.repository";
import {EmailAdapter} from "../../adapters/email.adapter";

export class ResendingCodeCommand {
    constructor(public email: string) {
    }
}

@CommandHandler(ResendingCodeCommand)
export class ResendingCodeUseCase implements ICommandHandler<ResendingCodeCommand>{
    constructor(private readonly usersRepository: UsersRepository,
                private readonly emailService: EmailAdapter) {
    }

    //переотправка кода
    async execute(command: ResendingCodeCommand): Promise<boolean> {
        const user = await this.usersRepository.readUserByEmail(command.email)
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


}