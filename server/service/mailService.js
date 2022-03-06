const nodemailer = require("nodemailer")

let mailer = {}

mailer.init = () => {
    mailer.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: "zumba.cafewe24@gmail.com",
            pass: "etjboqybpjydprny"

        }
    })
}

mailer.sendEmail = async (email, message) => {
    await mailer.transporter.sendMail({
        from: '"ONEAREA ONLINE" <zumba.cafewe24@gmail.com>',
        to: email,
        subject: "",
        text: message
    })
}

module.exports = mailer;