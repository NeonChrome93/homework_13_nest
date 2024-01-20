import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserCreateModelDto} from "../../../users/api/models/input/user.input.model";
import {UserViewModel} from "../../../users/api/models/output/user.output.model";
import bcrypt from "bcrypt";
import {User} from "../../../users/domain/user.entity";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {EmailAdapter} from "../../adapters/email.adapter";
import {DevicesService} from "../../../devices/application/device.service";
import {DevicesRepository} from "../../../devices/repositories/device.repository";
import {UsersRepository} from "../../../users/repositories/user.repository";


export class RegistrationUserCommand {
    constructor(public userCreateModel: UserCreateModelDto) {
    }
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
    constructor(private readonly emailService: EmailAdapter,
                private readonly usersRepository: UsersRepository) {
    }

    async execute(command: RegistrationUserCommand): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(command.userCreateModel.password, passwordSalt)

        const newUser: User = {
            _id: new ObjectId(),
            login: command.userCreateModel.login, //valitation not copy in database
            email: command.userCreateModel.email, //
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

}