import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const key = '7073a72433844cc6b2bc11e1634511f1';
const endpoint = 'https://serviziocognitivobobtv.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
    endpoint
);

export const analyzeImage = async (imageUrl: string) => {
    try {
        const analysis = await computerVisionClient.analyzeImage(imageUrl, {
            visualFeatures: [
                'Description', 
                'Categories',
                'Brands', 
                'Faces', 
                'Objects', 
                'Adult'
            ]
        });
        return analysis;
    } catch (error) {
        const errorMessage = (error as any).response?.data?.message || (error as any).message || 'Errore sconosciuto';
        throw new Error(`Errore nell'analisi dell'immagine: ${errorMessage}`);
    }
};

