import fs, {Stats} from "fs";
import dotenv from "dotenv";
import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import fetch, {ResponseInit} from "node-fetch";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import ErrnoException = NodeJS.ErrnoException;
import {performance} from 'perf_hooks';
import {fileURLToPath} from "url";
import path from "path";

// file pathing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env setup
dotenv.config({path: path.join(__dirname, "..", ".env")});

// stealth plugin setup
puppeteer.use(StealthPlugin());

// express setup
const app = express()
app.use(cors())

// body parser setup
app.use(bodyParser.urlencoded({extended: false})) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json


// create folder if it doesn't exist
const folderPath = path.join(__dirname, "..", "storage/clones");
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// Allocating dictionary to memory
let badWords: string[]
fs.readFile('server/storage/dictionary/bad-words', function (err: ErrnoException | null, data: { toString: () => string; }) {
    if (err) throw err;
    badWords = data.toString().replace(/\r\n/g, '\n').split('\n');
});

async function websiteValidity(link: string): Promise<number | undefined> {
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

async function profanityData(link: string, fileName: string) {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage();
    await page.goto(link);

    const startTime = performance.now() // start timer

    let newHtml = await page.evaluate(() => document.body.innerHTML)

    for (let badWord of badWords) {
        newHtml = newHtml.replace(new RegExp(`\\b${badWord}\\b`, "gi"), '*'.repeat(badWord.length));
    }

    await page.evaluate((newHtml) => document.body.innerHTML = newHtml, newHtml)

    const cdp = await page.target().createCDPSession();
    let {data} = await cdp.send('Page.captureSnapshot');

    await page.screenshot({path: `server/storage/clones/${fileName}.png`, fullPage: true});

    fs.writeFile(`server/storage/clones/${fileName}.mhtml`, data, "utf-8", function (err: ErrnoException | null) {
        if (err)
            throw err;
    });

    const endTime = performance.now() // end timer

    console.log(`${Math.round(((endTime - startTime) / 1000) * 100) / 100} seconds || ${endTime - startTime} milliseconds`)

    await browser.close();

    /* Profanity Information */
    const textContent: string = data.trim().replace(/[\s]+/g, " ")

    let profanityCount: number = 0;
    let wordCount: number = textContent.split(" ").length;

    for (let badWord of badWords) {
        let re = new RegExp(badWord, "gi");

        profanityCount += (textContent.match(re)?.length) ?? 0
    }

    return {
        wordCount,
        profanityCount,
        profanityMakeup: Math.round(((profanityCount / wordCount) * 100) * 100) / 100
    }
}


app.post('/api/link-validity', async (req, res) => {
    const {link} = req.body;

    const status = await websiteValidity(link);

    return res.send({
        status
    })
})


app.post('/api/website-link', async (req, res) => {
    const {link, fileName} = req.body;

    const profanityReport = await profanityData(link, fileName);

    res.send(profanityReport);

    console.log('Profanity processing completed');
})

app.post('/api/profanity-download', async (req, res) => {
    const {uuid} = req.body;

    let fileName: string

    if (req.body.html) {
        fileName = `${uuid}.mhtml`
    } else if (req.body.img) {
        fileName = `${uuid}.png`
    }

    res.download(path.join(__dirname, '..', `storage/clones/${fileName!}`));
})

app.post('/api/contact-us', async (req, res) => {
    const {email, message} = req.body

    console.log(`email: ${email}, message: ${message}`)

    return res.sendStatus(200).send()
});


app.listen(process.env.PORT || 3500, () => {
    console.log(`Listening on port ${process.env.PORT || 3500}`)
})


function fileCleanup() {
    fs.readdir(path.join(__dirname, '..', 'storage/clones'), (err: ErrnoException | null, files: string[]) => {
        if (err) throw err;

        for (let file of files) {
            fs.stat(path.join(__dirname, '..', 'storage/clones', file), (err: ErrnoException | null, stats: Stats) => {
                if (err) throw err;

                if (stats.isFile() && (Date.now() - stats.mtimeMs) > 30 * 60 * 1000) {
                    fs.rm(path.join(__dirname, '..', 'storage/clones', file), (err: ErrnoException | null) => {
                        if (err) throw err;
                    })
                }
            })
        }
    })
}

cron.schedule('*/5 * * * *', async () => {
    fileCleanup();
})