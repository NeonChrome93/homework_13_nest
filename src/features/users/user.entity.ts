import mongoose, {HydratedDocument, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "mongodb";

// export type UserDbModel = {
//     _id: ObjectId,
//     login: string,
//     email: string,
//     passwordSalt: string,
//     passwordHash: string,
//     createdAt: Date,
//     confirmationCode: string,
//     isConfirmed: boolean,
//     passwordRecoveryCode: string | null,
//     expirationDateOfRecoveryCode: Date | null
//
// }

export class  UserDbModel  {
    _id: ObjectId;
    login: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
    createdAt: Date;
    confirmationCode: string;
    isConfirmed: boolean;
    passwordRecoveryCode: string | null;
    expirationDateOfRecoveryCode: Date | null

}
export type UserDocument = HydratedDocument<User>;

@Schema(({collection: 'users'}))
export class User {
    @Prop({required: true,type: mongoose.Schema.Types.ObjectId })
    _id: Types.ObjectId
    @Prop({required: true, unique: true})
    login: string
    @Prop({required: true, unique: true})
    email: string
    @Prop({required: true})
    passwordSalt: string
    @Prop({required: true})
    passwordHash: string;
    @Prop({required: true,type: Date, default: Date.now})
    createdAt: Date;
    @Prop({required: true})
    confirmationCode: string;
    @Prop({type: Boolean,required: true})
    isConfirmed: boolean;
    @Prop({type: String, default: null})
    passwordRecoveryCode: string | null;
    @Prop({type: Date, default: null})
    expirationDateOfRecoveryCode: Date | null
}

export const UserSchema = SchemaFactory.createForClass(User)