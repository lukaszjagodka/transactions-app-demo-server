import { connection } from '../database/connection/ormConnection';
import { Currency } from '../database/entity/Currency';
import { logger } from '../utils/logs/logger';

export const findCurrency = async () => {
  try {
    const connect = await connection;
    const getLastCurrency = await connect.getRepository(Currency).findOne({ order: { id: 'DESC' }});
    return getLastCurrency;
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};