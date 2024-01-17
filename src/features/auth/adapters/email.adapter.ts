import nodemailer from "nodemailer";
import {randomUUID} from "crypto";
import {Injectable} from "@nestjs/common";

@Injectable()
export class EmailAdapter {


    async sendEmail(userEmail: string, code: string, message: string) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: 'daarksky1919@gmail.com',
                pass: 'xkechhtugnbjckly' //gmail key
            }
        });

// async..await is not allowed in global scope, must use a wrapper

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'Yarrow Dark 👻 <daarksky1919@gmail.com>', // sender address
            to: userEmail, // list of receivers
            subject: "Hello samurai ✔", // Subject line
            text: "sifhseiofhseif jweipfhwei pfhweifwehif", // plain text body
            html: `<h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
            </p>`, // html body
        });

        return;
    }

    async resendEmail( email: string, passwordRecoveryCode: string) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: 'daarksky1919@gmail.com',
                pass: 'xkechhtugnbjckly' //gmail key
            }
        })

// async..await is not allowed in global scope, must use a wrapper

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'Yarrow Dark 👻 <daarksky1919@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Hello samurai ✔", // Subject line
            text: "sifhseiofhseif jweipfhwei pfhweifwehif", // plain text body
            html: `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${passwordRecoveryCode}'>recovery password</a>
      </p>`
        });

        return;
    }
}