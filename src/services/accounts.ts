import { connection } from '../database/connection/ormConnection';
import { Account } from '../database/entity/Accounts';
import { logger } from '../utils/logs/logger';

export const findAccounts = async () => {
  try {
    const connect = await connection;
    const getAllAccounts = await connect.getRepository(Account).find();
    return getAllAccounts;
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};

export const saveAccounts = async (data: any) => {
  const { id, accountNumber, accountValue, currency } = data;
  try {
    const account = new Account();
    account.name = id;
    account.accountNumber = accountNumber;
    account.accountValue = accountValue;
    account.currency = currency;
    (await connection).manager
            .save(account)
            .then(account => {
                console.log('Account was saved.', account.id);
            });
    return 'account was saved';
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};
