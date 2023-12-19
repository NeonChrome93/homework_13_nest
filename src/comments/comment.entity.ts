import {ObjectId} from "mongodb";
import mongoose, {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {REACTIONS_ENUM} from "../models/comments-models";

export type CommentsDBType = {
    _id: ObjectId
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: Date
    reactions: StatusType[]
}

export type StatusType = {
    userId: string,
    createdAt: Date,
    status: REACTIONS_ENUM
}

export type CommentDocument = HydratedDocument<Comments>;



@Schema()
class Status {
    @Prop( {required: true})
    userId: string
    @Prop( {default: new Date})
    createdAt: Date
    @Prop( {required: true, enum: REACTIONS_ENUM})
    status: string
}

const statusSchema = SchemaFactory.createForClass(Status);

@Schema()
class CommentInfo {
    @Prop( {required: true})
    userId: string
    @Prop( {required: true})
    userLogin: string
}
const commentInfoSchema = SchemaFactory.createForClass(CommentInfo);

@Schema(({collection: 'comments'}))

export class Comments  {
    _id: ObjectId
    @Prop( {required: true})
    postId: string
    @Prop( {required: true})
    content: string
    @Prop( {type: commentInfoSchema,required: true})
    commentatorInfo: {CommentInfo }
    @Prop( {type: Date, default: Date.now})
    createdAt: Date
    @Prop( { type: statusSchema, default: []})
    reactions:  Status[]

}

export const CommentSchema = SchemaFactory.createForClass(Comments)



//посмотреть документацию содания схемы в несте смотреть как делать вложенные документы

