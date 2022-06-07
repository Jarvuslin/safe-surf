import { fileCleanup } from './filter.js';
import cron from "node-cron";
/* setup cronjob to clean up html clones */
cron.schedule('*/1 * * * *', async () => {
    await fileCleanup();
});
