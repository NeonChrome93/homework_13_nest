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
    constructor(name:string, description: string, websiteUrl: string, isMembership: boolean) {
        this._id = new mongoose.Types.ObjectId();
            this.name = name;
            this.description = description;
            this.websiteUrl = websiteUrl;
            this.createdAt = new Date();
            this.isMembership = isMembership
    }
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
    isMembership: boolean

}
//читать как сделать агрегацию двух схем
//почитать про $lookup
//сделать две схемы под посты и под лайки и обращаться к ним по отдельности

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