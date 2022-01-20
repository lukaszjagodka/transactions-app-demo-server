export interface IRow {
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