import { connection } from '../services/ormConnection';
import { fetch3x } from '../helpers/fetchCurrencies';
import { Currency } from "../entity/Currency";
import { IRow } from '../../types';
import { logger } from './logger';
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
        logger.log({
          level: 'success',
          message: 'Success insert currencies',
          date: new Date()
        });
      }).catch(error => { logger.log({ level: 'error', message: error });
      });
    }else{
      logger.log({
        level: 'info',
        message: 'Limit of 3 requests/hour have been reached'
      });
    }
  }catch(err){
    logger.warn('error', new Error(err));
  }
}, null, true, 'Europe/Warsaw');

export default job;
