import { logger } from '../utils/logger';
import { TRow } from '../types/types';
import fetch from 'node-fetch';

export const fetch3x = async (): Promise<Array<TRow>> => {
  try {
    const response = await fetch('https://www.live-rates.com/rates');
    const body = await response.json();
    return body;
  } catch (error) {
    logger.error({ level: 'error', additional: 'Fetch3x', message: error });
  }
};