import {InjectModel} from "@nestjs/mongoose";
import {User, UserDbModel, UserDocument} from "./user.entity";
import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";
import {ObjectId} from "mongodb";

@Injectable()
export class UsersRepository {
constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {
}

    async readUserById(id: string): Promise<UserDbModel | null> {
        const user: UserDbModel | null = await this.UserModel.findOne({_id: new ObjectId(id)});
        if (!user) {
            return null;
        }
        return user
    }

    // async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbModel | null> {
    //     return this.UserModel.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    // }

    async findUserByRecoveryCode(recoveryCode: string): Promise<UserDbModel | null> {
        const user: UserDbModel | null = await this.UserModel.findOne({passwordRecoveryCode: recoveryCode});
        if (!user) {
            return null;
        }
        return user
    }

    async createUser(newUser: UserDbModel) {
        return this.UserModel.create({...newUser})
    }

    async saveUser(newUser: UserDbModel) {
        const user = new this.UserModel(newUser)
        await user.save()
        return user
    }

    async deleteUser(id: string): Promise<boolean> {

        try {
            const filter = {_id: new ObjectId(id)}
            const res = await this.UserModel.deleteOne(filter).exec()
            return res.deletedCount === 1
        } catch (e) {
            return false
        }

    }

    async deleteAllUsers(): Promise<boolean> {
        // dbLocal.blogs = [];
        await this.UserModel.deleteMany({})
        return true
    }


    // async readUserByCode(code: string): Promise<UserDbModel | null> {
    //     const user: UserDbModel | null = await UserModel.findOne({confirmationCode: code});
    //     if (!user) {
    //         return null;
    //     }
    //     return user
    // }
    //
    // async confirmEmail(id: string): Promise<void> {
    //     await UserModel.updateOne({_id: new ObjectId(id)}, {$set: {isConfirmed: true}});
    //     return;
    // }
    //
    //
    // async readUserByEmail(email: string): Promise<UserDbModel | null> {
    //     const user: UserDbModel | null = await UserModel.findOne({email: email});
    //     if (!user) {
    //         return null;
    //     }
    //     return user
    // }
    //
    // async readUserByRecoveryCode(email: string): Promise<UserDbModel | null> {
    //     const user: UserDbModel | null = await UserModel.findOne({email: email});
    //     if (!user) {
    //         return null;
    //     }
    //     return user
    // }
    //
    // async updateConfirmationCode(id: string, newCode: string): Promise<any> {
    //     return UserModel.updateOne({_id: new ObjectId(id)},
    //         {$set: {confirmationCode: newCode}},);
    // }

}
