import { CronJob } from 'cron';
import insertToTable from '../helpers/insertToTable';

const job = new CronJob('*/20 * * * *', function() {
  insertToTable()
}, null, true, 'Europe/Warsaw');

export default job;