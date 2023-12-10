import {User, UserCreateModel, UserViewModel} from "../models/users-models";
import mongoose, {Types} from "mongoose";
import {UserDbModel} from "./user.entity";
import {Injectable} from "@nestjs/common";
import {UsersRepository} from "./user.repository";
import {ObjectId} from "mongodb";


@Injectable()
export class UserService {
constructor(private readonly usersRepository: UsersRepository) {
}
    // async getUsers(pagination:  QueryUserPaginationType) :Promise<PaginationModels<UserViewModel[]>> {
    //     return usersRepository.getUsers(pagination)
    // },

    async createUser(userCreateModel: UserCreateModel): Promise<UserViewModel> {
        // const passwordSalt = await bcrypt.genSalt(10)
        // const passwordHash = await this.generateHash(userCreateModel.password, passwordSalt)

        const newUser: UserDbModel= {
            _id: new mongoose.Types.ObjectId(),
           login: userCreateModel.login,
            email: userCreateModel.email,
            // passwordHash: passwordHash,
            // passwordSalt: passwordSalt,
           createdAt: new Date()
            // confirmationCode: '123',
            // isConfirmed: true,
            // passwordRecoveryCode: null,
            // expirationDateOfRecoveryCode: null
        }



       await this.usersRepository.createUser(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString()
        }
    }

    async findUserById(id: string): Promise<UserDbModel | null> {
        return this.usersRepository.readUserById(id)
    }

    // async checkCredentials(loginOrEmail: string, password: string): Promise<UserDbModel | null> {
    //     const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    //     if (!user) return null
    //     const passwordHash = await this.generateHash(password, user.passwordSalt)
    //     if (user.passwordHash !== passwordHash) {
    //         return null
    //     }
    //     return user
    //
    // },
    // async generateHash(password: string, salt: string) {
    //     const hash = await bcrypt.hash(password, salt)
    //     return hash
    // },

    async deleteUser(id: string): Promise<boolean> {
        const user = await this.usersRepository.readUserById(id)
        if (!user) return false
        return this.usersRepository.deleteUser(id)
    }
}