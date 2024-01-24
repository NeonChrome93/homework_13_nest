import mongoose, {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import {appSettings} from "../../src/config/app.settings";
import request from "supertest";
import {RegistrationUserUseCase} from "../../src/features/auth/application/usecases/registration-user.usecase";
import {EmailAdapter} from "../../src/features/auth/adapters/email.adapter";
import {ConfirmEmailUseCase} from "../../src/features/auth/application/usecases/confirm-email.usecase";
import {User} from "../../src/features/users/domain/user.entity";




const userData = {

    login: "Date",
    email: "y.smirnow@yandex.ru",
    password: "123456"
}

let SendEmailMock = jest.fn()

const EmailAdapterMock = {
    sendEmail: SendEmailMock
}
//commandBus = new CommandBus(moduleRef)

describe('Integration test Auth Service',() =>{



    describe('Registration user',  ()=> {
        let app;
        let registrationUserUseCase;
        let confirmEmailUseCase;
        let userModel;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            }).overrideProvider(EmailAdapter).useValue(EmailAdapterMock).compile();

            app = moduleFixture.createNestApplication();
            appSettings(app)

            // userModel = InjectModel(User.name);
            // userRepository = new UsersRepository(userModel)
            // createUserUseCase = new CreateUserUseCase(userRepository);
            registrationUserUseCase= moduleFixture.get<RegistrationUserUseCase>(RegistrationUserUseCase)
            confirmEmailUseCase = moduleFixture.get<ConfirmEmailUseCase>(ConfirmEmailUseCase)
            await app.init();


        });

        afterAll(async () => {
            await mongoose.disconnect()
        })

       beforeEach(async () => {
           await request(app.getHttpServer()).delete('/testing/all-data').expect(204)
       })

        it('Confirmation Code', async () => {
            let user : User = await registrationUserUseCase.execute({userCreateModel:userData });
            await confirmEmailUseCase.execute({code: "123" });
            expect(user.isConfirmed).toBe(true)


        })

    })


})