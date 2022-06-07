import {websiteValidity, profanityData, contactUs} from './filter.js';
import express, {Express} from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import {fileURLToPath} from "url";
import path from "path";


// file pathing
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

// express setup
const main: Express = express()
main.use(cors())

// body parser setup
main.use(bodyParser.urlencoded({extended: false})) // parse application/x-www-form-urlencoded
main.use(bodyParser.json()) // parse application/json

/* retrieves users link and verifies if website exists. */
main.post('/api/link-validity', async (req, res) => {
    const {link}: { link: string } = req.body;

    const status: number = (await websiteValidity(link))!;

    return res.send({
        status
    })
})

/* retrieves users link and generates profanity report of website */
main.post('/api/website-link', async (req, res) => {
    const {link, fileName}: { link: string, fileName: string } = req.body;

    const profanityReport = await profanityData(link, fileName);

    return res.send(profanityReport);
})


/* sends user file to be downloaded */
main.post('/api/profanity-download', async (req, res) => {
    const {uuid}: { uuid: string } = req.body;

    let fileName: string

    if (req.body.html) {
        fileName = `${uuid}.mhtml`
    } else if (req.body.img) {
        fileName = `${uuid}.png`
    }

    return res.download(path.join(__dirname, '..', `storage/clones/${fileName!}`));
})


/* gets user information */
main.post('/api/contact-us', async (req, res) => {
    await contactUs(req.body);

    return res.sendStatus(200);
});


/* manually set and listen on port 3500 */
main.listen(process.env.PORT || 3500, () => {
    console.log(`Listening on port ${process.env.PORT || 3500}`)
})