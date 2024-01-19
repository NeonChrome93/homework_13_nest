import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserCreateModelDto} from "../../../../models/users-models";
import {UsersRepository} from "../../repositories/user.repository";

export class DeleteUserCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
    constructor(private readonly usersRepository: UsersRepository) {
    }


    async execute(command: DeleteUserCommand): Promise<boolean> {
        const user = await this.usersRepository.readUserById(command.id)
        if (!user) return false
        return this.usersRepository.deleteUser(command.id)
    }

}