export interface TRow {
  currency: string,
  rate: string,
  bid: string,
  ask: string,
  high: string,
  low: string,
  open: string,
  close: string,
  timestamp: Date,
}

export type TPair = {
  pair: string,
  value: string
}

export type TAccount = {
  id: number
  name: string,
  accountNumber: number,
  accountValue: number,
  currency: string
}

export type TTransaction = {
  account: number;
  name: string;
  id: number;
  date: string;
  amountFirstPair: number;
  currencyFirstPair: string;
  rate: number;
  amountSecondPair: number;
  currencySecondPair: string;
}

export type TUpdateAccountValue = {
  accountValue: number,
  id: number
}