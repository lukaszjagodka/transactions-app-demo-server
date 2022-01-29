import express from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import 'dotenv/config';
import bodyParser from 'body-parser';
import rates from './src/controllers/rates';
import job from './src/services/cron';

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use(helmet());
app.use('/rates', rates);

job.start();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
