import express from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import 'dotenv/config';
import transactions from './src/controllers/transactions';
import accounts from './src/controllers/accounts';
import rates from './src/controllers/rates';
import job from './src/services/cron';

const app = express();
const port = 3001;

app.use(express.json());
app.use(helmet());

app.use('/rates', rates);
app.use('/accounts', accounts);
app.use('/transactions', transactions);

job.start();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
