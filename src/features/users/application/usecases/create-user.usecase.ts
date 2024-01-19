import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserCreateModelDto, UserViewModel} from "../../../../models/users-models";
import bcrypt from "bcrypt";
import {User} from "../../domain/user.entity";
import mongoose from "mongoose";
import {UsersRepository} from "../../repositories/user.repository";

export class CreateUserCommand{
    constructor(public userCreateModel: UserCreateModelDto) {
    }
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(private readonly usersRepository: UsersRepository) {
    }

    async execute(command: CreateUserCommand): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        //  const passwordHash = await this.generateHash(userCreateModel.password, passwordSalt)
        const passwordHash = await bcrypt.hash(command.userCreateModel.password, passwordSalt)

        const newUser: User = {
            _id: new mongoose.Types.ObjectId(),
            login: command.userCreateModel.login,
            email: command.userCreateModel.email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date(),
            confirmationCode: '123',
            isConfirmed: true,
            passwordRecoveryCode: null,
            expirationDateOfRecoveryCode: null
        }


        await this.usersRepository.createUser(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString()
        }
    }

}