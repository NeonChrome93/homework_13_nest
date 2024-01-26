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
import {UsersRepository} from "../../src/features/users/repositories/user.repository";
import {UserViewModel} from "../../src/features/users/api/models/output/user.output.model";




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
        let userRepository;

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
            userRepository = moduleFixture.get<UsersRepository>(UsersRepository)

            await app.init();


        });

        afterAll(async () => {
            await mongoose.disconnect()
        })

       beforeEach(async () => {
           await request(app.getHttpServer()).delete('/testing/all-data').expect(204)
       })

        it('confirmation code positive', async () => {
            let user :  UserViewModel = await registrationUserUseCase.execute({userCreateModel:userData });
            let repoCode = (await userRepository.readUserById(user.id) as User).confirmationCode

           let confirm =  await confirmEmailUseCase.execute({code: repoCode });

            let userConfirmation = await userRepository.readUserById(user.id)
            expect(userConfirmation.isConfirmed).toBe(true)

        })

        it('confirmation code negative', async () => {
            let user :  UserViewModel = await registrationUserUseCase.execute({userCreateModel:userData });
            let repoCode = (await userRepository.readUserById(user.id) as User).confirmationCode

            let confirm =  await confirmEmailUseCase.execute({code: ' ' });

            let userConfirmation = await userRepository.readUserById(user.id)
            expect(userConfirmation.isConfirmed).toBe(false)


        })

    })


})