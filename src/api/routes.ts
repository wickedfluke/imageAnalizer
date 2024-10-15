import express from 'express';
import visionRouter from './vision/vision.router';

const router = express.Router();

router.use('/vision', visionRouter);

export default router;