require('dotenv').config();
const pg = require('pg');
import { fetch3x } from "../fetch/fetchCurrencies";
import truncateTable from './truncateTable';
import { TObject } from "../types";

const conString = process.env.CON_STRING;

const insertToTable = async () => {
  const data: Array<TObject> = await fetch3x();
  const client = new pg.Client(conString);
  if(data.length > 1){
    truncateTable()
    .then(function(){
      let query = '';
      for(let i=0; i<data.length; i++){
        query+=`('${data[i].currency}',${data[i].rate}),`
      }
      query = query.slice(0, -1);
      const sqlQuery = `INSERT INTO currencies VALUES ${query}`
      client.connect(function(err: any) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        client.query(sqlQuery, function(err: any, result: any) {
          if(err) {
            return console.error('error running query', err);
          }
          client.end();
        });
      });
    })
  }else{
    console.log('Error: '+ Object.values(data[0]))
  }
}

export default insertToTable;
