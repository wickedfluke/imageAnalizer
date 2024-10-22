import { Router } from 'express';
import MessageController from './message.controller';

const router = Router();

router.post('/send', MessageController.sendMessage);
router.get('/device/:deviceId', MessageController.getMessagesByDeviceId);
router.get('/search', MessageController.searchMessages);
router.get('/dates', MessageController.getMessagesBetweenDates);
router.patch('/received/:messageId', MessageController.markMessageAsReceived);


export default router;
