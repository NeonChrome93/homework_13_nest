import {ObjectId} from "mongodb";
import mongoose, {HydratedDocument, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {REACTIONS_ENUM} from "../../comments/api/models/output/comments.output.models";

export type postDbType= {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
    reactions: StatusType[]
}


export type PostDocument = HydratedDocument<Post>;

@Schema({_id: false})
class Status {
    @Prop( {required: true})
    userId: string
    @Prop( {required: true})
    login: string
    @Prop( {default: new Date})
    createdAt: Date
    @Prop( {required: true, enum: REACTIONS_ENUM})
    status: string
}

const statusSchema = SchemaFactory.createForClass(Status);


@Schema(({collection: 'posts'}))
export class Post {
    @Prop({required: true,  type: mongoose.Schema.Types.ObjectId })
    _id?: Types.ObjectId
    @Prop()
    title:string
    @Prop()
    shortDescription: string
    @Prop()
    content: string
    @Prop()
    blogId: string
    @Prop()
    blogName: string
    @Prop({default: new Date})
    createdAt: Date
    @Prop({type: [statusSchema]})
     reactions: StatusType[]

}


export class StatusType  {
    userId: string
    login:string
    createdAt: Date
    status: REACTIONS_ENUM
}

export const PostSchema = SchemaFactory.createForClass(Post)

