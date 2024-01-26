import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import {EmailAdapter} from "../../src/features/auth/adapters/email.adapter";
import {appSettings} from "../../src/config/app.settings";
import {RegistrationUserUseCase} from "../../src/features/auth/application/usecases/registration-user.usecase";
import {ConfirmEmailUseCase} from "../../src/features/auth/application/usecases/confirm-email.usecase";
import {PasswordRecoveryUseCase} from "../../src/features/auth/application/usecases/password-recovery.usecase";
import {UsersRepository} from "../../src/features/users/repositories/user.repository";
import mongoose from "mongoose";
import request from "supertest";
import {UserViewModel} from "../../src/features/users/api/models/output/user.output.model";
import {User} from "../../src/features/users/domain/user.entity";
import {NewPasswordSetUseCase} from "../../src/features/auth/application/usecases/new-password-set.usecase";

const userData = {

    login: "Date",
    email: "y.smirnow@yandex.ru",
    password: "123456"
}

let SendEmailMock = jest.fn()

const EmailAdapterMock = {
    sendEmail: SendEmailMock,
    resendEmail: SendEmailMock
}


describe('Integration test Auth Service - Recovery code', () => {


    describe('Recovery code', () => {
        let app;
        let registrationUserUseCase;
        let confirmEmailUseCase;
        let passwordRecoveryUseCase;
        let userRepository;
        let newPasswordSetUseCase;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            }).overrideProvider(EmailAdapter).useValue(EmailAdapterMock).compile();

            app = moduleFixture.createNestApplication();
            appSettings(app)

            // userModel = InjectModel(User.name);
            // userRepository = new UsersRepository(userModel)
            // createUserUseCase = new CreateUserUseCase(userRepository);
            registrationUserUseCase = moduleFixture.get<RegistrationUserUseCase>(RegistrationUserUseCase)
            confirmEmailUseCase = moduleFixture.get<ConfirmEmailUseCase>(ConfirmEmailUseCase)
            passwordRecoveryUseCase = moduleFixture.get<PasswordRecoveryUseCase>(PasswordRecoveryUseCase)
            userRepository = moduleFixture.get<UsersRepository>(UsersRepository)
            newPasswordSetUseCase = moduleFixture.get<NewPasswordSetUseCase>( NewPasswordSetUseCase)

            await app.init();


        });

        afterAll(async () => {
            await mongoose.disconnect()
        })

        beforeEach(async () => {
            await request(app.getHttpServer()).delete('/testing/all-data').expect(204)
        })

        it('recovery code has been passed', async () => {
            let user: UserViewModel = await registrationUserUseCase.execute({userCreateModel: userData});
            let repoCode = (await userRepository.readUserById(user.id) as User).isConfirmed === true
            await confirmEmailUseCase.execute({code: '123' });
            let userAlreadyConfirmation = await userRepository.readUserById(user.id)

            expect(userAlreadyConfirmation.isConfirmed).toBe(false)

            await passwordRecoveryUseCase.execute({email: userAlreadyConfirmation.email})
            let userAfterRecovery = await userRepository.readUserByEmail(userAlreadyConfirmation.email)

            let setPassword = await newPasswordSetUseCase.execute({newPassword: '12345', recoveryCode: userAfterRecovery.passwordRecoveryCode})

            expect(userAfterRecovery .passwordRecoveryCode === null && userAfterRecovery .expirationDateOfRecoveryCode === null)
            expect(setPassword).toBe(true)
        })

        it('recovery code has not been passed', async () => {
            let user: UserViewModel = await registrationUserUseCase.execute({userCreateModel: userData});
            let userAlreadyConfirmation = await userRepository.readUserById(user.id)
            await passwordRecoveryUseCase.execute({email: userAlreadyConfirmation.email})
            let userAfterRecovery = await userRepository.readUserByEmail( userAlreadyConfirmation.email)
            let setPassword = await newPasswordSetUseCase.execute({newPassword: '', recoveryCode: userAfterRecovery.passwordRecoveryCode})
            expect(userAfterRecovery .passwordRecoveryCode && userAfterRecovery .expirationDateOfRecoveryCode)
            expect(setPassword).toBe(false)
        })


    })



})