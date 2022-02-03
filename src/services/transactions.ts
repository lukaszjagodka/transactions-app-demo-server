import { connection } from '../database/connection/ormConnection';
import { Account } from '../database/entity/Account';
import { Transaction } from '../database/entity/Transaction';
import { TTransaction } from '../types/types';
import { logger } from '../utils/logger';

export const getTransactions = async (key: any) => {
  const id:number = +Object.values(key)[0];
  try {
    const connect = await connection;
    const getTransactions = await connect.getRepository(Transaction).find({ account: { id } });
    return getTransactions;
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};

export const saveTransactions = async (data: TTransaction ) => {
  const { 
    accountId,
    name,
    id,
    date,
    amountFirstPair,
    currencyFirstPair,
    rate,
    amountSecondPair,
    currencySecondPair
  } = data;
  const connect = await connection;
  try {
    const accountRepository = connect.getRepository(Account);
    const user = await accountRepository.findOne({ id: accountId });
    const newTranasction: any = {
      account: user.id,
      name, 
      id,
      date,
      amountFirstPair,
      currencyFirstPair,
      rate,
      amountSecondPair,
      currencySecondPair
    };
    const transaction = connect.getRepository(Transaction).create(newTranasction);
    await connect.getRepository(Transaction).save(transaction);
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};
