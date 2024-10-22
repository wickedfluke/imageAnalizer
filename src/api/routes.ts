import express from 'express';
import visionRouter from './vision/vision.router';
import messageRouter from './message/message.router';

const router = express.Router();

router.use('/vision', visionRouter);
router.use('/message', messageRouter);

export default router;