import {Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Query, Res} from "@nestjs/common";
import {UserCreateModel, UsersQueryType} from "../models/users-models";
import {getQueryUserPagination} from "../utils/pagination";
import {UsersQueryRepository} from "./user.query.repository";
import {UserService} from "./user.service";


@Controller('users')
export class UserController {
    constructor(private readonly  usersQueryRepository: UsersQueryRepository,
                private readonly  userService: UserService) {
    }

    @Get()
    async getUsers (@Query() queryDto: UsersQueryType) {
    const pagination = getQueryUserPagination(queryDto)
    const arr = await this.usersQueryRepository.getUsers(pagination);
    return arr


}

    @Post()
    @HttpCode(201)
    async CreateUser (@Body() userDto: UserCreateModel) {

        const newUser = await this.userService.createUser(userDto);
        return newUser
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') userId: string)  {
        const isDeleted = await this.userService.deleteUser(userId);
        if(isDeleted) {
            return isDeleted
        }
        else throw new NotFoundException('user not found')

    }
}