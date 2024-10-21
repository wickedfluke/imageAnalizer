// src/controllers/computerVisionController.ts
import { Request, Response } from 'express';
import { analyzeAndTranslateImages } from '../vision/vision.service';

export const analyzeImageController = async (req: Request, res: Response) => {
    const { languages, imageFiles } = req.body;

    // Validazione degli input
    if (!languages || !Array.isArray(languages) || languages.length === 0) {
        return res.status(400).json({ error: 'La lista delle lingue è richiesta e deve essere un array non vuoto.' });
    }

    if (!imageFiles || !Array.isArray(imageFiles) || imageFiles.length === 0) {
        return res.status(400).json({ error: 'La lista dei file immagine è richiesta e deve essere un array non vuoto.' });
    }

    try {
        // Chiamata alla funzione di analisi e traduzione delle immagini
        await analyzeAndTranslateImages(languages, imageFiles);
        
        // Risposta di successo
        res.json({ message: 'Analisi e traduzione delle immagini completata con successo.' });
    } catch (error) {
        // Risposta in caso di errore
        res.status(500).json({ error: (error as any).message || 'Errore sconosciuto durante l\'analisi delle immagini.' });
    }
};
