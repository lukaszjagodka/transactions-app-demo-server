import { logger } from '../utils/logs/logger';
import { IRow } from '../types/types';
import fetch from 'node-fetch';

export const fetch3x = async (): Promise<Array<IRow>> => {
  try {
    const response = await fetch('https://www.live-rates.com/rates');
    const body = await response.json();
    return body;
  } catch (error) {
    logger.error({ level: 'error', additional: 'Fetch3x', message: error });
  }
};