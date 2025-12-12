import { Router } from 'express';
import {
  uploadLogsHandler,
  getLogsHandler,
  getStatsHandler,
} from '../controllers/logs.controller';

const router = Router();

router.post('/upload', uploadLogsHandler);

router.get('/', getLogsHandler);

router.get('/stats', getStatsHandler);

export default router;
