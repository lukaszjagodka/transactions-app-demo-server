import { connection } from '../database/connection/ormConnection';
import { Currency } from '../database/entity/Currency';
import { logger } from '../utils/logger';

export const findCurrency = async () => {
  try {
    const connect = await connection;
    const lastCurrency = await connect.getRepository(Currency).findOne({ order: { id: 'DESC' }});
    return lastCurrency;
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};