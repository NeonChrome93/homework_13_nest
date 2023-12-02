import mongoose, {HydratedDocument, Types} from "mongoose";
import {ObjectId} from "mongodb";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type BlogDbType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean
}

export type BlogDocument = HydratedDocument<Blog>;

@Schema(({collection: 'blogs'}))

export class Blog {
    @Prop({required: true,  type: mongoose.Schema.Types.ObjectId })
    _id: Types.ObjectId
    @Prop()
    name:string
    @Prop()
    description: string
    @Prop()
    websiteUrl: string
    @Prop({default: new Date})
    createdAt: Date
    @Prop()
    isMembership: Boolean

}
//читать как сделать агрегацию двух схем
//почитать про $lookup

export const BlogSchema = SchemaFactory.createForClass(Blog);

//
// const blogSchema = new mongoose.Schema<BlogDbType>({
//     name: {type: String, require: true},
//     description: {type: String, require: true},
//     websiteUrl: {type: String, require: true},
//     createdAt: {type: Date, default: new Date},
//     isMembership: {type: Boolean, default: false}
//
// })
// //..
//
// export const BlogModel = mongoose.model<mongoose.Schema<BlogDbType>>('blogs', blogSchema)