import express from 'express';
import cors from 'cors';
import logsRouter from './routes/logs.routes';

const app = express();

app.disable('etag');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/logs', logsRouter);

export default app;
