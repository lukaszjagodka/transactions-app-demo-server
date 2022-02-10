  The purpose of the application is introduce a currencies change with use a real currency rates.
In very simple way we can create account with interest us balance.
The operation of the application is based on the exchange of information between the client and the server.
The application server takes care of the up-to-date rates, which are downloaded from the free api 3 times an hour. (It's a maximum number of downloads rates from this api)
User accounts and user transactions are stored in the ElephantSQL cloud and are provided by the server.

The client-server application was developed using the following technologies:

# [Server](https://github.com/lukaszjagodka/transactions-app-demo-server) 

## Technologies
* Express (Helmet, Winston, Cron)
* Typescript
* TypeORM
* Eslint
* Nodemon

### What we can do?
Using typeorm:
- Save currencies/accounts/transactions to ElephantSQL
- Load above on server and send it to client side
- Delete accounts and using relations delete transactoins related to them

# [Client](https://github.com/lukaszjagodka/transactions-app-demo) 

## Technologies
* React
* Typescript
* Redux-toolkit
* Eslint 
* Material-ui (to styling table and navbar)

### What we can do?
Crud functionality:
- Create/delete accounts
- Create transactions
- Change currnecy on other
- Load currencies/accounts/transactions from server
- Save above on the server
