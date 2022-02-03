import { connection } from '../database/connection/ormConnection';
import { Account } from '../database/entity/Account';
import { IDeleteAccount } from '../types/types';
import { logger } from '../utils/logger';

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
    return 'account has been saved';
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};

export const deleteAccount = async (data: IDeleteAccount) => {
  const { id } = data;
  const connect = await connection;
  try {
    const accountRepository = connect.getRepository(Account);
    const foundAccount = await accountRepository.findOne({ id });
    if(foundAccount){
      await accountRepository.remove(foundAccount);
    }
    return 'account has been deleted';
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};
