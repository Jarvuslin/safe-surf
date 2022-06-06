import {websiteValidity, profanityData, fileCleanup} from './filter.js';
import dotenv from "dotenv";
import cron from "node-cron";
import express, {Express} from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import {fileURLToPath} from "url";
import path from "path";
import nodemailer, {SentMessageInfo} from "nodemailer";

// file pathing
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

// .env setup
dotenv.config({path: path.join(__dirname, "..", ".env")});

// stealth plugin setup
puppeteer.use(StealthPlugin());

// express setup
const main: Express = express()
main.use(cors())

// body parser setup
main.use(bodyParser.urlencoded({extended: false})) // parse application/x-www-form-urlencoded
main.use(bodyParser.json()) // parse application/json



main.post('/api/link-validity', async (req, res) => {
    const {link} = req.body;

    const status = await websiteValidity(link);

    return res.send({
        status
    })
})

main.post('/api/website-link', async (req, res) => {
    const {link, fileName} = req.body;

    const profanityReport = await profanityData(link, fileName);

    return res.send(profanityReport);
})

main.post('/api/profanity-download', async (req, res) => {
    const {uuid} = req.body;

    let fileName: string

    if (req.body.html) {
        fileName = `${uuid}.mhtml`
    } else if (req.body.img) {
        fileName = `${uuid}.png`
    }

    return res.download(path.join(__dirname, '..', `storage/clones/${fileName!}`));
})

main.post('/api/contact-us', async (req, res) => {
    const {firstName, lastName, email, subject, message} = req.body

   console.log(firstName, lastName, email, subject, message)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return res.sendStatus(200);
});

main.listen(process.env.PORT || 3500, () => {
    console.log(`Listening on port ${process.env.PORT || 3500}`)
})


cron.schedule('*/1 * * * *', async () => {
    await fileCleanup();
});

// safesurf.help@gmail.com
// KLJkjdfhaks789732984u932