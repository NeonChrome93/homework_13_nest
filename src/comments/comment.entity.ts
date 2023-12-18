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

export type CommentDocument = HydratedDocument<Comments>;

@Schema(({collection: 'comments'}))

export class Comments  {
    @Prop( {required: true})
    postId: string
    @Prop( {required: true})
    content: string
    @Prop( {required: true})
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    @Prop( {type: Date, default: Date.now})
    createdAt: Date
    @Prop( { default: []})
    reactions:  [Status]

}

class Status {
    @Prop( {required: true})
    userId: string
    @Prop( {default: new Date})
    createdAt: Date
    @Prop( {required: true, enum: REACTIONS_ENUM})
    status: string
}

export type StatusType = {
    userId: string,
    createdAt: Date,
    status: REACTIONS_ENUM
}

export const CommentSchema = SchemaFactory.createForClass(Comments)