const fetch = require("node-fetch");
import { TObject } from "../types";

export const fetch3x = async (): Promise<Array<TObject>> => {
  try {
    const response = await fetch('https://www.live-rates.com/rates');
    const body = await response.json();
    return body;
  } catch (error: any) {
    throw(error)
  }
}