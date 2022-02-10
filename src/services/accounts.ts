import { connection } from '../database/connection/ormConnection';
import { Account } from '../database/entity/Account';
import { TUpdateAccountValue } from '../types/types';
import { logger } from '../utils/logger';

export const findAccounts = async () => {
  try {
    const connect = await connection;
    const getAccounts = await connect
      .getRepository(Account)
      .find({
        order: {
          id: 'DESC' 
        }
      });
    return getAccounts;
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};
export const createAccount = async (data: Account) => {
  const connect = await connection;
  try {
    const account = connect.getRepository(Account).create(data);
    const createdAccount = await connect.getRepository(Account).save(account);
    return createdAccount;
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};

export const deleteAccount = async (id: number) => {
  const connect = await connection;
  try {
    const accountRepository = connect.getRepository(Account);
    const foundAccount = await accountRepository.findOne(id);
    await accountRepository.remove(foundAccount);
    return 'account has been deleted';
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};

export const updateAccountValue = async (data: TUpdateAccountValue) => {
  const { actualBalance, id } = data;
  const connect = await connection;
  try {
    const accountRepository = connect.getRepository(Account);
    const foundAccount = await accountRepository.findOne(id);
    foundAccount.accountValue = actualBalance;
    await accountRepository.save(foundAccount);
  } catch (error) {
    logger.log({ level: 'error', message: error });
  }
};
