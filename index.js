const express = require('express');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();
const app = express();
const port = 3001;

app.use(express.json());

// Creating an endpoint for sending normal emails
app.post('/email',(req, res)=>{
    let config = {
        service: 'gmail', // your email domain
        auth: {
            user: process.env.NODEJS_GMAIL_APP_USER,   // your email address
            pass: process.env.NODEJS_GMAIL_APP_PASSWORD // your password
        }
    }
    let transporter = nodemailer.createTransport(config);

    let message = {
        from: 'wanuja18@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Welcome to ABC Website!', // Subject line
        html: "<b>Hello world?</b>", // html body
        attachments: [ // use URL as an attachment
            {
              filename: 'receipt_test.pdf',
              path: 'receipt_test.pdf',
              cid: 'uniqreceipt_test.pdf' 
            }
        ]
    };

    transporter.sendMail(message).then((info) => {
        return res.status(201).json(
            {
                msg: "Email sent",
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            }
        )
    }).catch((err) => {
        return res.status(500).json({ msg: err });
    }
    );
})


// Creating an endpoint for sending customized emails
app.post('/customized-email',(req, res)=>{
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.NODEJS_GMAIL_APP_USER,
            pass: process.env.NODEJS_GMAIL_APP_PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'YOUR_PRODUCT_NAME',
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: 'Name',
            intro: 'Welcome to ABC Company! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with ABC, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: 'https://mailgen.js/'
                }
            }
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: 'wanuja18@gmail.com',
        to: req.body.email,
        subject: 'Welcome to ABC company!',
        html: mail,
        attachments: [
            {
              filename: 'receipt_test.pdf',
              path: 'receipt_test.pdf',
              cid: 'uniqreceipt_test.pdf' 
            }
        ]
    };

    transporter.sendMail(message).then((info) => {
        return res.status(201).json(
            {
                msg: "Email sent",
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            }
        )
    }).catch((err) => {
        return res.status(500).json({ msg: err });
    }
    );
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    }
);

