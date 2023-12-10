import mongoose, {HydratedDocument, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "mongodb";

export type UserDbModel = {
    _id: ObjectId,
    login: string,
    email: string,
    // passwordSalt: string,
    // passwordHash: string,
    createdAt: Date,
    // confirmationCode: string,
    // isConfirmed: boolean,
    // passwordRecoveryCode: string | null,
    // expirationDateOfRecoveryCode: Date | null

}
export type UserDocument = HydratedDocument<User>;

@Schema(({collection: 'users'}))



export class User {
    @Prop({required: true,  type: mongoose.Schema.Types.ObjectId })
    _id: Types.ObjectId
    @Prop()
    login: string
    @Prop()
    email: string
    @Prop()
    createdAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)