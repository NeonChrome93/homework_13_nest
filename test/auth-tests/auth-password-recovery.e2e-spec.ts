import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import {EmailAdapter} from "../../src/features/auth/adapters/email.adapter";
import {appSettings} from "../../src/config/app.settings";
import {RegistrationUserUseCase} from "../../src/features/auth/application/usecases/registration-user.usecase";
import {ConfirmEmailUseCase} from "../../src/features/auth/application/usecases/confirm-email.usecase";
import mongoose from "mongoose";
import request from "supertest";
import {User} from "../../src/features/users/domain/user.entity";
import {PasswordRecoveryUseCase} from "../../src/features/auth/application/usecases/password-recovery.usecase";
import {UsersRepository} from "../../src/features/users/repositories/user.repository";
import {UserViewModel} from "../../src/features/users/api/models/output/user.output.model";
import {randomUUID} from "crypto";
import e from "express";


const userData = {

    login: "Date",
    email: "y.smirnow@yandex.ru",
    password: "123456"
}

let SendEmailMock = jest.fn()

const EmailAdapterMock = {
    sendEmail: SendEmailMock,
    resendEmail:  SendEmailMock
}


describe('Integration test Auth Service - Recovery code',() =>{



    describe('Recovery code',  ()=> {
        let app;
        let registrationUserUseCase;
        let confirmEmailUseCase;
        let passwordRecoveryUseCase;
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
            passwordRecoveryUseCase = moduleFixture.get<PasswordRecoveryUseCase>(PasswordRecoveryUseCase)
            userRepository = moduleFixture.get<UsersRepository>(UsersRepository)

            await app.init();


        });

        afterAll(async () => {
            await mongoose.disconnect()
        })

        beforeEach(async () => {
            await request(app.getHttpServer()).delete('/testing/all-data').expect(204)
        })

        it('should return positive recovery code', async () => {
            let user : UserViewModel = await registrationUserUseCase.execute({userCreateModel:userData });
            let userNotConfirmation = await userRepository.readUserById(user.id)
            let recovery = await passwordRecoveryUseCase.execute({email: userNotConfirmation.email})

            expect(recovery).toBe(true)
            expect(EmailAdapterMock.resendEmail).toBeCalled()

        })

        it('should return negative recovery code', async () => {
            let user : UserViewModel = await registrationUserUseCase.execute({userCreateModel:userData });
            let repoCode = (await userRepository.readUserById(user.id) as User).confirmationCode === ''
            await confirmEmailUseCase.execute({code: repoCode });
            let userNotConfirmation = await userRepository.readUserById(user.id)

            expect( userNotConfirmation.isConfirmed ).toBe(false)



        })

    })


})