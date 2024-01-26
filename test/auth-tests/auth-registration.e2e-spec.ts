import mongoose, {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import {appSettings} from "../../src/config/app.settings";
import request from "supertest";
import {RegistrationUserUseCase} from "../../src/features/auth/application/usecases/registration-user.usecase";
import {EmailAdapter} from "../../src/features/auth/adapters/email.adapter";
import {UsersRepository} from "../../src/features/users/repositories/user.repository";
import {User} from "../../src/features/users/domain/user.entity";
import {UserViewModel} from "../../src/features/users/api/models/output/user.output.model";

const userData = {

    login: "Date",
    email: "y.smirnow@yandex.ru",
    password: "123456"
}

const userData2 = {

    login: "Date2",
    email: " ",
    password: "1234567"
}


let sendEmailMock = jest.fn((email: any) => {
    let res = String(email).toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    if (!res) {
        throw new Error()
    }
    return res
}  )
const emailAdapterMock = {
    sendEmail: sendEmailMock
}
 //commandBus = new CommandBus(moduleRef)

describe('Integration test Auth Service',() =>{



    describe('Registration user',  ()=> {
        let app;
        let userRepository;
        //let createUserUseCase;
        let userModel;

        beforeEach(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            }).overrideProvider(EmailAdapter).useValue(emailAdapterMock).compile();

                app = moduleFixture.createNestApplication();
            appSettings(app)

            // userModel = InjectModel(User.name);
            // userRepository = new UsersRepository(userModel)
            // createUserUseCase = new CreateUserUseCase(userRepository);
            //createUserUseCase = moduleFixture.get<RegistrationUserUseCase>(RegistrationUserUseCase)
            userRepository = moduleFixture.get<UsersRepository>(UsersRepository)
            await app.init();
        });

        afterAll(async () => {
           await mongoose.disconnect()
        })

        it('Before all', async () => {
            await request(app.getHttpServer()).delete('/testing/all-data').expect(204)
        })

        it('Send Email positive', async () => {
            const command = app.get(RegistrationUserUseCase)
            await command.execute({userCreateModel:userData });
            expect(emailAdapterMock.sendEmail).toBeCalled()

        })


        it('Send Email negative', async () => {
            const command = app.get(RegistrationUserUseCase)
            let userReg =  await command.execute({userCreateModel:userData2 })
            //let user = (await userRepository.readUserById(userReg)as User).confirmationCode == null
            expect(userReg).toBe(null);

        })

    })


})