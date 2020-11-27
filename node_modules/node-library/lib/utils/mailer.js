"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
console.log(nodemailer, smtpTransport);
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: "starlight.mailer.service@gmail.com",
        pass: "Mailer@Starlight*com"
    }
}));
console.log(transporter);
function sendMail(data) {
    const { from, to, subject, text } = data;
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from,
            to: [to, 'karthik.munipalle21@gmail.com', 'abhivadnala@gmail.com'],
            subject,
            text
        }, function (error, response) {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
}
exports.default = sendMail;
