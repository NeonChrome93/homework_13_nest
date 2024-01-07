import request from "supertest";
import {UserCreateModelDto, UserViewModel} from "../src/models/users-models";
import {INestApplication} from "@nestjs/common";

const authBasicHeaders = {
  "Authorization": "Basic YWRtaW46cXdlcnR5",
  "user-agent": "Mozilla"

}

export type UserCreationTestModel = {
  email: string,
  login: string,
  password: string
}

export async function createUser(app: INestApplication ,model: UserCreationTestModel): Promise<UserViewModel>{
  const result =  await request(app.getHttpServer()).post('/users').set(authBasicHeaders).send({
    ...model
  })

  return result.body;
}

// async createUser(model: UserCreateModel): Promise<UserViewModel> {
//     const result = await this.config
//         .getHttp()
//         .post('/sa/users')
//         .set('Authorization', 'Basic ' + authBasic64)
//         .set('Content-Type', 'application/json')
//         .send({
//             ...model,
//         } as UserCreateModel);
//     return result.body;
// }


export function createNewUserModel(): UserCreationTestModel {
  const { login, password } = generateCredentials();
  return {
    email: `${login}@gmail.com`,
    login,
    password,
  };
}


function generateCredentials(loginLength = 8, passwordLength = 8): { login: string; password: string } {
  return { login: generateString(loginLength), password: generateString(passwordLength) };
}


function generateString(length = 20): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let string: string = '';
  for (let i = 0; i < length; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
}