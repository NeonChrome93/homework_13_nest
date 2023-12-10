import {ObjectId} from "mongoose";

export type UserCreateModel = {
    login: string
    email: string
    password: string
}

export class User  {
  constructor(
   public login: string,
   public email: string,
   public createdAt: string) {
  }
}



export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UsersQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string | null
}
