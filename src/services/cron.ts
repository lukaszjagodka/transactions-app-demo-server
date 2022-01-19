import { connection } from '../services/ormConnection';
import { fetch3x } from '../helpers/fetchCurrencies';
import { Currency } from "../entity/Currency";
import { IRow } from '../../types';
import { CronJob } from 'cron';

const job = new CronJob('*/20 * * * *', async function() {
  try{
    const data: Array<IRow> = await fetch3x();
    if(data.length > 1){
      let query = '';
      for(let i=0; i<data.length; i++){
        query+=`{"${data[i].currency}",${data[i].rate}},`
      }
      query = query.slice(0, -1)
      connection.then(async connection => {
        let currency = new Currency();
        currency.currencyString = query;
        currency.createdAt = new Date;
        await connection.manager.save(currency);
      }).catch(error => console.log(error));
    }else{
      console.log('Limit of 3 requests/hour have been reached')
    }
  }catch(err){
    console.log(err)
  }
}, null, true, 'Europe/Warsaw');

export default job;
