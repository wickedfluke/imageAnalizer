import mongoose, { Schema, Document } from 'mongoose';

// Definizione dell'interfaccia per il documento
export interface IMessage extends Document {
    messageId: mongoose.Types.ObjectId;
    dateSent: Date;
    messageText: string;
    deviceId: string;
    received: boolean;
}

// Definizione dello schema per il messaggio
const MessageSchema: Schema = new Schema({
    messageId: { type: mongoose.Types.ObjectId, required: true },
    dateSent: { type: Date, required: true },
    messageText: { type: String, required: true },
    deviceId: { type: String, required: true },
    received: { type: Boolean, required: true }
});

// Creazione del modello
export default mongoose.model<IMessage>('Message', MessageSchema);
