import {fileCleanup} from './filter.js';
import cron from "node-cron";

cron.schedule('*/1 * * * *', async () => {
    await fileCleanup();
});
