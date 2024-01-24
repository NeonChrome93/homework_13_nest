import mongoose, {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import {appSettings} from "../../src/config/app.settings";
import request from "supertest";
import {RegistrationUserUseCase} from "../../src/features/auth/application/usecases/registration-user.usecase";
import {EmailAdapter} from "../../src/features/auth/adapters/email.adapter";




const userData = {

    login: "Date",
    email: "y.smirnow@yandex.ru",
    password: "123456"
}

let sendEmailMock = jest.fn()
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
            await app.init();
        });

        afterAll(async () => {
           await mongoose.disconnect()
        })

        it('Before all', async () => {
            await request(app.getHttpServer()).delete('/testing/all-data').expect(204)
        })

        it('Send Email Mock', async () => {
            const createUserUseCase = app.get(RegistrationUserUseCase)
            await createUserUseCase.execute({userCreateModel:userData });
           // expect(emailAdapterMock.sendEmail).toBeCalled()

        })

    })


})