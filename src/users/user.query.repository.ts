import {QueryUserPaginationType} from "../utils/pagination";
import {UserViewModel} from "../models/users-models";
import {PaginationModels} from "../models/pagination-models";
import e from "express";
import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./user.entity";
import {Model} from "mongoose";

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {
    }
    async getUsers(pagination: QueryUserPaginationType): Promise<PaginationModels<UserViewModel[]>> {

        const filter = ({
            $or: [
                {login: {$regex: pagination.searchLoginTerm, $options: 'i'}},
                {email: {$regex: pagination.searchEmailTerm, $options: 'i'}}
            ]
        })

        const users = await this.UserModel
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await this.UserModel.countDocuments(filter).exec()
        const items = users.map((u) => ({
            id: u._id.toString(),
            login: u.login,
            email: u.email,
            createdAt: u.createdAt.toISOString()


        }))
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }


}