import {REACTIONS_ENUM} from "../models/comments-models";

export class StatusType  {
    _id: string
    userId: string
    login:string
    createdAt: Date
    status: REACTIONS_ENUM
    likedEntityId: string

}