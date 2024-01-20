import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {randomUUID} from "crypto";
import {UsersRepository} from "../../../users/repositories/user.repository";
import {EmailAdapter} from "../../adapters/email.adapter";
import {add} from "date-fns";

export class PasswordRecoveryCommand {
    constructor(public email: string) {
    }
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand>{
    constructor(private readonly usersRepository: UsersRepository,
                private readonly emailService: EmailAdapter) {
    }

    //восстановление пароля
    async execute(command:PasswordRecoveryCommand): Promise<boolean> {
        const user = await this.usersRepository.readUserByEmail(command.email)
        if (!user) return false;

        user.passwordRecoveryCode =  randomUUID();
        user.expirationDateOfRecoveryCode = add(new Date(), {
            hours: 1,
            minutes: 3
        });

        await this.usersRepository.saveUser(user);

        try {
            this.emailService.resendEmail(command.email, user.passwordRecoveryCode)
        } catch (e) {
            console.log("code resending email error", e);
        }
        return true
    }

}