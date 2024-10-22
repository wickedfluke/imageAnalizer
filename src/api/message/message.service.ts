import { Client } from 'azure-iot-device';
import { Message } from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';
import MessageModel, { IMessage } from './message.model';
import mongoose from 'mongoose';

const connectionString = 'HostName=hubiot2.azure-devices.net;DeviceId=dspstv1;SharedAccessKeyName=iothubowner;SharedAccessKey=VqkwVWK339BiylBghK4K+Ve83+Bz01Xy8AIoTJ3hkZ0=';
const client = Client.fromConnectionString(connectionString, Mqtt);

class MessageService {

    // Metodo per inviare un messaggio a un device
    async sendMessage(deviceId: string, messageText: string): Promise<IMessage> {
        const messageId = new mongoose.Types.ObjectId(); // ID unico
        const messagePayload = {
            messageId: messageId,
            dateSent: new Date(),
            messageText: messageText,
            deviceId: deviceId,
            received: false
        };

        const azureMessage = new Message(JSON.stringify(messagePayload));
        azureMessage.properties.add('deviceId', deviceId);

        try {
            await client.open();
            await client.sendEvent(azureMessage);
            console.log('Messaggio inviato al device:', deviceId);

            // Salvataggio del messaggio su MongoDB
            const newMessage = new MessageModel(messagePayload);
            return await newMessage.save();
        } catch (err) {
            console.error('Errore nell\'invio del messaggio:', err);
            throw new Error('Errore nell\'invio del messaggio');
        } finally {
            await client.close();
        }
    }

    // Metodo per cercare messaggi per deviceId
    async findMessagesByDeviceId(deviceId: string): Promise<IMessage[]> {
        return await MessageModel.find({ deviceId: deviceId });
    }

    // Metodo per cercare messaggi con testo parziale (LIKE)
    async searchMessagesByText(text: string): Promise<IMessage[]> {
        return await MessageModel.find({ messageText: { $regex: text, $options: 'i' } });
    }

    // Metodo per cercare messaggi tra due date
    async findMessagesBetweenDates(startDate: Date, endDate: Date): Promise<IMessage[]> {
        return await MessageModel.find({
            dateSent: { $gte: startDate, $lte: endDate }
        });
    }

    // Metodo per aggiornare il campo "received" per un messaggio
    async markMessageAsReceived(messageId: mongoose.Types.ObjectId): Promise<IMessage | null> {
        return await MessageModel.findByIdAndUpdate(
            messageId,
            { received: true },
            { new: true }
        );
    }
}

export default new MessageService();
