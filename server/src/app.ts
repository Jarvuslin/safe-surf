import fs from "fs";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import ErrnoException = NodeJS.ErrnoException;
import {performance} from 'perf_hooks';

dotenv.config();

puppeteer.use(StealthPlugin());

const app = express()
app.use(cors())


app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

//
// function profanityReport(wordCount: number, profanityCount: number) {
//     console.log(process.env.SEP);
//     console.log(`Word Count: ${wordCount}`);
//     console.log(`Profanity Count: ${profanityCount}`);
//     console.log(`Profanity Makeup: ${Math.round(((profanityCount / wordCount) * 100) * 100) / 100}`);
//     console.log(process.env.SEP);
// }


// // Allocating bad words to memory on launch
// let badWords: string[] = []
// fs.readFile('dictionary/bad-words', function (err: ErrnoException | null, data: { toString: () => string; }) {
//     if (err) throw err;
//     badWords = data.toString().replace(/\r\n/g, '\n').split('\n');
// });
//
// (async () => {
//     const browser = await puppeteer.launch({
//         headless: false
//     })
//     const page = await browser.newPage();
//     await page.goto('https://www.sparknotes.com/nofear/shakespeare/hamlet/act-1-scene-2/');
//
//     // time
//     const startTime = performance.now()
//
//     let i = 0
//
//     let newHtml = await page.evaluate(() => document.body.innerHTML)
//
//     for (let badWord of badWords) {
//         newHtml = newHtml.replace(new RegExp(`\\b${badWord}\\b`, "gi"), '*'.repeat(badWord.length));
//         console.log(i++)
//     }
//
//     await page.evaluate((newHtml) => document.body.innerHTML = newHtml, newHtml)
//
//     const cdp = await page.target().createCDPSession();
//     let {data} = await cdp.send('Page.captureSnapshot');
//
//     await page.screenshot({path: 'clones/screenshot.png', fullPage: true});
//
//     await fs.writeFile('clones/clone.html', data, "utf-8", function (err: ErrnoException | null) {
//         if (err) throw err;
//     });
//
//     // time
//     const endTime = performance.now()
//
//     console.log(`${Math.round(((endTime - startTime) / 1000) * 100) / 100} seconds || ${endTime - startTime} milliseconds`)
//
//     await browser.close();
//
//     /* Profanity Information */
//     const textContent: string = data.trim().replace(/[\s]+/g, " ")
//
//     let profanityCount: number = 0;
//     let wordCount:number = textContent.split(" ").length;
//
//     for (let badWord of badWords) {
//         let re = new RegExp(badWord, "gi");
//
//         profanityCount += (textContent.match(re)?.length) ?? 0
//     }
//
//     profanityReport(wordCount, profanityCount)
// })();



app.post('/api/profanity', async function (req, res) {
    console.log(await req.body)

    // send response back to client
    res.send({
        message: 'Profanity Checker',
    })
})

app.listen(5000);
console.log('Server running on port 5000');