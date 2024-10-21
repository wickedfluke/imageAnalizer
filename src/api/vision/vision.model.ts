import mongoose, { Document, Schema } from 'mongoose';

// Estendere l'interfaccia Vision con Document di Mongoose per includere funzionalità di MongoDB
export interface VisionDocument extends Document {
    fileName: string;
    language: string;
    description: string;
    tags: string[];
}

// Definizione dello schema Mongoose
const visionSchema = new Schema<VisionDocument>({
    fileName: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true }
});

// Configurazione per escludere i campi _id e __v dalle risposte JSON e dagli oggetti
visionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete ret._id;
    }
});

visionSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete ret._id;
    }
});

// Esportazione del modello
export const visionModel = mongoose.model<VisionDocument>('Vision', visionSchema);
