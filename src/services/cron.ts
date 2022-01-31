import { connection } from '../database/connection/ormConnection';
import { fetch3x } from '../helpers/fetchCurrencies';
import { Currency } from '../database/entity/Currency';
import { IRow, TPair } from '../types/types';
import { logger } from '../utils/logs/logger';
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

const createArrayCurrencies = (data: Array<IRow>) => {
  const arrayOfCurrencies = [];
  data.forEach(({ currency, rate }) => {
    if(currency.includes('USD/') || currency.includes('/USD')){
      arrayOfCurrencies.push({
        pair: currency,
        value: rate
      });
    }
  });
  return arrayOfCurrencies;
};

const job = new CronJob('*/20 * * * *', async function() {
  try{
    const data: Array<IRow> = await fetch3x();
    if(data.length > 1){
      createCurrency(createArrayCurrencies(data));
    }else{
      logger.log({
        level: 'info',
        message: 'Limit of 3 requests/hour have been reached'
      });
    }
  }catch(err){
    logger.log({ level: 'error', message: err });
  }
}, null, true, 'Europe/Warsaw');

export default job;
