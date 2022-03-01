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

mailer.sendEmail = async (email, content) => {
    const _status = await mailer.transporter.sendMail({
        from: '"AREA" <zumba.cafewe24@gmail.com>',
        to: email,
        subject: "",
        text: "email automatique"
    })
}

module.exports = mailer;