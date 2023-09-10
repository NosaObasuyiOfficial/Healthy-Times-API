"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtmlForUser = exports.sendmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.DEV_GMAIL_USER,
        pass: process.env.DEV_GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendmail = (from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reponse = yield exports.transporter.sendMail({
            from: process.env.DEV_GMAIL_USER,
            to,
            subject,
            html,
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendmail = sendmail;
const emailHtmlForUser = (user_name, token) => {
    const mail = `
                  <h4>Dear ${user_name},<h4><br>
                    <img src = "https://www.thinklocal.co.za/images/AFrqS4eNQ4sQKjhx/1476189587_140058_fs.jpg" alt = "healthy times logo" style = "width:150px; height:70px">
                    <h2>Verify your email</h2><br>
                    <p>Click the button below to login. Your link expires in 24 hours.</p><br>
                    <a href = "http://localhost:4070/user/confirmation/${token}">
                    <button style = "color:white; padding: 6px 23px; border: 2px solid red; background-color:red; text-align:center; border-radius:4px">VERIFY</button>
                    </a>
                    <br>
                    <p style = "padding-top: 5px">If you're having troubles with the button above, <a href = "http://localhost:4070/user/confirmation/${token}"><span style = "color:red">click here</span></a></p>
                    <p style = "padding-top: 7px">Powered by <span style = "color:red; font-size:16px" >Heål†h¥ †imeś<span/></p>`;
    return mail;
};
exports.emailHtmlForUser = emailHtmlForUser;
// <img src = "../../images/ht_logo.png" >
// <button style = "color:red">VERIFY</button><br>
// export const emailHtmlForUser = (user_name:string, token:string)=>{
//     const mail = `
//                   <h4>Dear ${user_name},<h4><br>
//                     <img src = "https://www.thinklocal.co.za/images/AFrqS4eNQ4sQKjhx/1476189587_140058_fs.jpg" alt = "healthy times logo" style = "width:150px; height:70px">
//                     <h2>Verify your email</h2><br>
//                     <p>Click the button below to login. Your link expires in 30 minutes.</p><br>
//                     <a href = "http://localhost:4070/user/confirmation/${token}">
//                     <button style = "color:white; padding: 6px 23px; border: 2px solid red; background-color:red; text-align:center; border-radius:4px">VERIFY</button>
//                     </a>
//                     <br>
//                     <p style = "padding-top: 5px">If you're having troubles with the button above, <a href = "http://localhost:4070/user/confirmation/${token}"><span style = "color:red">click here</span></a></p>
//                     <p style = "padding-top: 7px">Powered by <span style = "color:red" >Heål†h¥ †imeś<span/></p>`
//                     return mail
// }
