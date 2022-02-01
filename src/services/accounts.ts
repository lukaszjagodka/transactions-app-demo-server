import { connection } from '../database/connection/ormConnection';
import { Account } from '../database/entity/Accounts';
import { logger } from '../utils/logs/logger';

export const findAccounts = async () => {
  try {
    const connect = await connection;
    const getAccounts = await connect.getRepository(Account).find();
    return getAccounts;
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};

export const saveAccounts = async (data: Account) => {
  const { name, accountNumber, accountValue, currency } = data;
  const connect = await connection;
  try {
    const newAccount: Partial<Account> = {
      name, accountNumber, accountValue,currency
    };
    const account = connect.getRepository(Account).create(newAccount);
    await connect.getRepository(Account).save(account);
    return 'account was saved';
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};