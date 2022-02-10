import { connection } from '../database/connection/ormConnection';
import { Account } from '../database/entity/Account';
import { Transaction } from '../database/entity/Transaction';
import { TTransaction } from '../types/types';
import { logger } from '../utils/logger';


export const getTransactions = async (id: number) => {
  try {
    const connect = await connection;
    const getTransactions = await connect
      .getRepository(Transaction)
      .find({
        where: {
          account: { id },
        },
        order: { date: 'DESC' }
      });
    return getTransactions;
  } catch (error) {
   logger.log({ level: 'error', message: error });
  }
};

export const createTransaction = async (data: TTransaction ) => {
  const { account, date, ...rest } = data;

  const connect = await connection;
  try {
    const accountRepository = connect.getRepository(Account);
    const foundAccount = await accountRepository.findOne({ id: account });
    const newTranasction: Partial<Transaction> = {
      account: {
        id: foundAccount.id,
      },
      date: new Date(date),
      ...rest,
    };
    const transaction = connect.getRepository(Transaction).create(newTranasction);
    await connect.getRepository(Transaction).save(transaction);
  } catch (error) {

    logger.log({ level: 'error', message: error });
  }
};
