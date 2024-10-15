import { Request, Response } from 'express';
import { analyzeImage } from '../vision/vision.service';

export const analyzeImageController = async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: 'L\'URL dell\'immagine è richiesto.' });
    }

    try {
        const analysisResult = await analyzeImage(imageUrl);
        res.json(analysisResult);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};
