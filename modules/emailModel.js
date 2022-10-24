const mailgun = require("mailgun-js");
const validator = require('email-validator');

const API_KEY = process.env.MAILGUN_APIKEY;
const DOMAIN = "sandboxc696d941cdd847458ce63f8ee5a63c9e.mailgun.org";

const mg = mailgun({apiKey: API_KEY, domain:DOMAIN});


const emailModel = {
    sendEmail: async function sendEmail(res, body) {
        const email = body.email;
        const mg = mailgun({apiKey: API_KEY, domain:DOMAIN});

        // Check if email is valid
        if (!validator.validate(email)) {
        return res.status(400).json({
            errors: {
                status: 400,
                message: "Invalid email-adress"
            }
        })
    };

    const data = {
        from: 'Excited User <mailgun@sandboxc696d941cdd847458ce63f8ee5a63c9e.mailgun.org>',
        to: email,
        subject: 'Try out this text editor!',
        text: 'A friend has invited you to try out this React Text Editor, follow this link to sign up: http://www.student.bth.se/~osid15/editor/'
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
        console.log(error);
    });


    },
};

module.exports = emailModel;


