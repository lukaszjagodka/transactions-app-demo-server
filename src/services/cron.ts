import { CronJob } from 'cron';
import { IRow } from '../../types';
import { fetch3x } from '../helpers/fetchCurrencies';
import client from './dbConnection';

const job = new CronJob('*/20 * * * *', async function() {
  try{
    const data: Array<IRow> = await fetch3x();
    if(data.length > 1){
        let query = '';
        for(let i=0; i<data.length; i++){
          query+=`"("${data[i].currency}",${data[i].rate})",`
        }
        query = query.slice(0, -2);
        query = query.substring(1);
        const sqlQuery = `INSERT INTO currencies (currencyString, createdAt) VALUES ('[${query}]', CURRENT_TIMESTAMP)`
          client.query(sqlQuery, function(err: any, result: any) {
            if(err) {
              return console.error('error running query', err);
            }
          });
    }else{
      console.log('Limit of 3 requests/hour have been reached')
    }
  }catch(err: any){
    console.log(err)
  }
}, null, true, 'Europe/Warsaw');

export default job;