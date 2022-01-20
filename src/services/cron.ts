import { connection } from '../database/connection/ormConnection';
import { fetch3x } from '../helpers/fetchCurrencies';
import { Currency } from '../database/entity/Currency';
import { IRow, TPair } from '../types/types';
import { logger } from './logger';
import { CronJob } from 'cron';

const createCurrency = async (arrayOfCurrencies:Array<TPair>) => {
  try {
    const connect = await connection;
    const currency = new Currency();
    currency.currencyString = JSON.stringify(arrayOfCurrencies);
    await connect.manager.save(currency);
  } catch (err) {
    logger.log({ level: 'error', message: err });
  }
};

const job = new CronJob('*/20 * * * *', async function() {
  try{
    const data: Array<IRow> = await fetch3x();
    if(data.length > 1){
      let objCurrencyPair = {};
      const arrayOfCurrencies = [];
      data.forEach(currencyInfo => {
        if(currencyInfo.currency.includes('USD/') || currencyInfo.currency.includes('/USD')){
          objCurrencyPair = {
            pair: currencyInfo.currency,
            value: currencyInfo.rate
          };
          arrayOfCurrencies.push(objCurrencyPair);
        }
      }),
      createCurrency(arrayOfCurrencies);
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
