import fetch from 'node-fetch';
import { IRow } from "../../types";

export const fetch3x = async (): Promise<Array<IRow>> => {
  try {
    const response = await fetch('https://www.live-rates.com/rates');
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error)
  }
}