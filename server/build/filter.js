import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
// file pathing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// .env setup
dotenv.config({ path: path.join(__dirname, "..", ".env") });
// create folder if it doesn't exist
await fs.mkdir(path.join(__dirname, '..', 'storage/clones'), { recursive: true });
// allocating dictionary to memory
const badWords = (await fs.readFile(path.join(__dirname, '..', 'storage/dictionary/bad-words'), 'utf-8'))
    .replace(/\r\n/g, '\n')
    .split('\n');
// stealth plugin setup
puppeteer.use(StealthPlugin());
// open puppeteer browser to be used later
const browser = await puppeteer.launch({
    headless: true
});
/* check validity of website by sending HEAD request */
export const websiteValidity = async (link) => {
    try {
        // HEAD request to check website validity
        const response = await fetch(link, {
            method: 'HEAD',
        });
        return response.status;
    }
    catch {
        return 404;
    }
};
/* retrieves profanity data for report */
export const profanityData = async (link, fileName) => {
    const page = await browser.newPage();
    await page.goto(link);
    const profanityData = await page.evaluate((badWords) => {
        const content = document.body.innerText.replace(/[^\w\s]/gi, '').split(/\s+|\n+/);
        const wordCount = content.length;
        const profanityCount = content.filter(word => badWords.includes(word.toLowerCase())).length;
        const profanityMakeup = Math.round((profanityCount / wordCount) * 100 * 100) / 100;
        return {
            wordCount,
            profanityCount,
            profanityMakeup
        };
    }, badWords);
    let newHtml = await page.evaluate((badWords) => {
        let html = document.body.innerHTML;
        for (let badWord of badWords) {
            html = html.replace(new RegExp(`\\b${badWord}\\b`, "gi"), '*'.repeat(badWord.length));
        }
        return html;
    }, badWords);
    await page.evaluate((newHtml) => document.body.innerHTML = newHtml, newHtml);
    const cdp = await page.target().createCDPSession();
    let { data } = await cdp.send('Page.captureSnapshot');
    await page.screenshot({ path: `server/storage/clones/${fileName}.png`, fullPage: true });
    await fs.writeFile(path.join(__dirname, '..', 'storage/clones', fileName + '.mhtml'), data, "utf-8");
    await page.close();
    return profanityData;
};
/* set up email variables for contact page */
export const contactUs = async (data) => {
    const { firstName, lastName, email, subject, message } = data;
    console.log(firstName, lastName, email, subject, message);
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
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};
/* clean up storage/clones every 15 minutes */
export const fileCleanup = async () => {
    const files = await fs.readdir(path.join(__dirname, '..', 'storage/clones'));
    for (let file of files) {
        const stats = await fs.stat(path.join(__dirname, '..', 'storage/clones', file));
        if (stats.isFile() && (Date.now() - stats.mtimeMs) > (15 * 60 * 1000)) {
            await fs.unlink(path.join(__dirname, '..', 'storage/clones', file));
        }
    }
};
