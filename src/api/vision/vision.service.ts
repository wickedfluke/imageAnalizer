import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const key = '53f9cb70915b44659c1698eb516fd80f';
const endpoint = 'https://your-resource-name.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
    endpoint
);

export const analyzeImage = async (imageUrl: string) => {
    try {
        const analysis = await computerVisionClient.analyzeImage(imageUrl, {
            visualFeatures: ['Categories', 'Description', 'Color']
        });
        return analysis;
    } catch (error) {
        throw new Error(`Errore nell'analisi dell'immagine: ${error as any}`);
    }
};
