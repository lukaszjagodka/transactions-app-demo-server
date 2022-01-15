require('dotenv').config();
const pg = require('pg');

const conString = process.env.CON_STRING;

const deleteTable = async () => {
  return new Promise(function (resolve, reject){
      const client = new pg.Client(conString);
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