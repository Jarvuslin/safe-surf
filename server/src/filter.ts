import {Stats} from "fs";
import fs from "fs/promises";
import path from "path";
import {fileURLToPath} from "url";
import dotenv from "dotenv";
import { Page, Browser, CDPSession } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import fetch, {ResponseInit} from "node-fetch";
import nodemailer, {SentMessageInfo} from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";


// file pathing
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

// .env setup
dotenv.config({path: path.join(__dirname, "..", ".env")});

// create folder if it doesn't exist
await fs.mkdir(path.join(__dirname, '..', 'storage/clones'), {recursive: true});

// allocating dictionary to memory
const badWords: string[] = (await fs.readFile(path.join(__dirname, '..', 'storage/dictionary/bad-words'), 'utf-8'))
    .replace(/\r\n/g, '\n')
    .split('\n');

// stealth plugin setup
puppeteer.use(StealthPlugin());

// open puppeteer browser to be used later
const browser: Browser = await puppeteer.launch({
    headless: true
});

/* check validity of website by sending HEAD request */
export const websiteValidity = async (link: string): Promise<number | undefined> => {
    try {
        // HEAD request to check website validity
        const response: ResponseInit = await fetch(link, {
            method: 'HEAD',
        });

        return response.status;
    } catch {
        return 404;
    }
}

/* retrieves profanity data for report */
export const profanityData = async (link: string, fileName: string): Promise<{ [key: string]: number }> => {
    const page: Page = await browser.newPage();
    await page.goto(link);

    const profanityData = await page.evaluate((badWords) => {
        const content: string[] = document.body.innerText.replace(/[^\w\s]/gi, '').split(/\s+|\n+/);

        const wordCount: number = content.length;
        const profanityCount: number = content.filter(word => badWords.includes(word.toLowerCase())).length;
        const profanityMakeup: number = Math.round((profanityCount / wordCount) * 100 * 100) / 100;

        return {
            wordCount,
            profanityCount,
            profanityMakeup
        }
    }, badWords);

    let newHtml: string = await page.evaluate((badWords) => {
        let html: string = document.body.innerHTML;

        for (let badWord of badWords) {
            html = html.replace(new RegExp(`\\b${badWord}\\b`, "gi"), '*'.repeat(badWord.length));
        }

        return html;
    }, badWords);

    await page.evaluate((newHtml) => document.body.innerHTML = newHtml, newHtml)

    const cdp: CDPSession = await page.target().createCDPSession();
    let {data} = await cdp.send('Page.captureSnapshot');

    await page.screenshot({path: `server/storage/clones/${fileName}.png`, fullPage: true});

    await fs.writeFile(path.join(__dirname, '..', 'storage/clones', fileName + '.mhtml'), data, "utf-8");

    await page.close();

    return profanityData;
}

/* set up email variables for contact page */
export const contactUs = async (data: { [key: string]: string }) => {
    const {firstName, lastName, email, subject, message} = data;

    console.log(firstName, lastName, email, subject, message)

    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions: {[key: string]: string} = {
        from: email,
        to: process.env.EMAIL_USER!,
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
}

/* clean up storage/clones every 15 minutes */
export const fileCleanup = async (): Promise<void> => {
    const files: string[] = await fs.readdir(path.join(__dirname, '..', 'storage/clones'));

    for (let file of files) {
        const stats: Stats = await fs.stat(path.join(__dirname, '..', 'storage/clones', file));

        if (stats.isFile() && (Date.now() - stats.mtimeMs) > (15 * 60 * 1000)) {
            await fs.unlink(path.join(__dirname, '..', 'storage/clones', file));
        }
    }
}
