import 'dotenv/config';
import * as pg from "pg";

const conString = process.env.CON_STRING;
const client = new pg.Client(conString);

const deleteTable = async () => {
  return new Promise(function (resolve, reject){
      
      client.connect(function(err: any) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query(`TRUNCATE TABLE currencies;`, function(err: any, result: any) {
        if(err) {
          return console.error('error running query', err);
        }
        client.end();
        resolve(result);
      });
    });  
  })
}

export default deleteTable;