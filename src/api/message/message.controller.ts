import { Request, Response } from 'express';
import MessageService from './message.service';
import mongoose from 'mongoose';

class MessageController {

    // Invia messaggio a un device
    async sendMessage(req: Request, res: Response) {
        const { deviceId, messageText } = req.body;
        try {
            const message = await MessageService.sendMessage(deviceId, messageText);
            return res.status(201).json(message);
        } catch (error) {
            return res.status(500).json({ error: 'Errore durante l\'invio del messaggio.' });
        }
    }

    // Ricerca messaggi per DeviceID
    async getMessagesByDeviceId(req: Request, res: Response) {
        const { deviceId } = req.params;
        try {
            const messages = await MessageService.findMessagesByDeviceId(deviceId);
            return res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({ error: 'Errore durante la ricerca.' });
        }
    }

    // Ricerca messaggi per testo (LIKE)
    async searchMessages(req: Request, res: Response) {
        const { text } = req.query;
        try {
            const messages = await MessageService.searchMessagesByText(text as string);
            return res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({ error: 'Errore durante la ricerca.' });
        }
    }

    // Ricerca messaggi tra due date
    async getMessagesBetweenDates(req: Request, res: Response) {
        const { startDate, endDate } = req.query;
        try {
            const messages = await MessageService.findMessagesBetweenDates(new Date(startDate as string), new Date(endDate as string));
            return res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({ error: 'Errore durante la ricerca.' });
        }
    }

    // Imposta messaggio come ricevuto
    async markMessageAsReceived(req: Request, res: Response) {
        const { messageId } = req.params;
        try {
            const message = await MessageService.markMessageAsReceived(new mongoose.Types.ObjectId(messageId));
            return res.status(200).json(message);
        } catch (error) {
            return res.status(500).json({ error: 'Errore durante l\'aggiornamento del messaggio.' });
        }
    }
}

export default new MessageController();
