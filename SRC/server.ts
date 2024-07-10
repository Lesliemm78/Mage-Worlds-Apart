import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {router as authRoutes} from './routes/auth';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use('/auth', authRoutes);