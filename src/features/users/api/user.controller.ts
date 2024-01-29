import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Query,
    Res,
    UseGuards
} from "@nestjs/common";
import {getQueryUserPagination} from "../../../utils/pagination";
import {UsersQueryRepository} from "../repositories/user.query.repository";
import {UserService} from "../application/user.service";
import {BasicAuthGuard} from "../../../infrastructure/guards/basic-auth.guard";
import {CommandBus} from "@nestjs/cqrs";
import {CreateUserCommand} from "../application/usecases/create-user.usecase";
import {DeleteUserCommand} from "../application/usecases/delete-user.usecase";
import {UserCreateModelDto, UsersQueryType} from "./models/input/user.input.model";



@Controller('users')
export class UserController {
    constructor(private readonly  usersQueryRepository: UsersQueryRepository,
                private readonly  userService: UserService,
                private readonly commandBus: CommandBus) {
    }

    @Get()
    @UseGuards(BasicAuthGuard)
    async getUsers (@Query() queryDto: UsersQueryType) {
    const pagination = getQueryUserPagination(queryDto)
    const arr = await this.usersQueryRepository.getUsers(pagination);
    return arr


}

    @Post()
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async CreateUser (@Body() userDto: UserCreateModelDto) {

        const newUser = await this.commandBus.execute(new CreateUserCommand(userDto));
        return newUser
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deleteUser(@Param('id') userId: string)  {
        const isDeleted = await this.commandBus.execute(new DeleteUserCommand(userId));
        if(isDeleted) {
            return isDeleted
        }
        else throw new NotFoundException('user not found')

    }
}