// src/services/computerVisionService.ts
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import axios from 'axios';

const key = '7073a72433844cc6b2bc11e1634511f1';
const endpoint = 'https://serviziocognitivobobtv.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
    endpoint
);

const translatorKey = '53f9cb70915b44659c1698eb516fd80f';
const translatorEndpoint = 'https://api.cognitive.microsofttranslator.com';
const translatorRegion = 'switzerlandnorth';

interface ExtendedAnalyzeImageResponse {
    translatedDescriptions: {
        it: string;
        de: string;
        fr: string;
        ja: string;
    };
    translatedCategories: {
        it: string;
        de: string;
        fr: string;
        ja: string;
    }[];
    translatedTags: {
        it: string;
        de: string;
        fr: string;
        ja: string;
    }[];
    [key: string]: any;
}

const translateText = async (text: string, targetLanguages: string[]) => {
    try {
        const response = await axios.post(
            `${translatorEndpoint}/translate`,
            [{ Text: text }],
            {
                params: {
                    'api-version': '3.0',
                    to: targetLanguages.join(',')
                },
                headers: {
                    'Ocp-Apim-Subscription-Key': translatorKey,
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Region': translatorRegion
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Errore nella traduzione del testo: ${(error as any).message}`);
    }
};

export const analyzeImage = async (imageUrl: string): Promise<ExtendedAnalyzeImageResponse> => {
    try {
        const analysis = await computerVisionClient.analyzeImage(imageUrl, {
            visualFeatures: [
                'Description', 
                'Categories',
                'Brands', 
                'Faces',
                'Objects',
                'Tags', 
                'Adult'
            ]
        });

        const descriptionText = analysis.description?.captions?.[0]?.text || 'Nessuna descrizione disponibile';

        const translatedDescriptions = await translateText(descriptionText, ['it', 'de', 'fr', 'ja']);
        
        const translatedCategories = await Promise.all(
            (analysis.categories || []).map(async category => {
                const translations = await translateText(category.name!, ['it', 'de', 'fr', 'ja']);
                return {
                    it: translations[0]?.translations.find(t => t.to === 'it')?.text || '',
                    de: translations[0]?.translations.find(t => t.to === 'de')?.text || '',
                    fr: translations[0]?.translations.find(t => t.to === 'fr')?.text || '',
                    ja: translations[0]?.translations.find(t => t.to === 'ja')?.text || ''
                };
            })
        );

        const translatedTags = await Promise.all(
            (analysis.tags || []).map(async tag => {
                const translations = await translateText(tag.name!, ['it', 'de', 'fr', 'ja']);
                return {
                    it: translations[0]?.translations.find(t => t.to === 'it')?.text || '',
                    de: translations[0]?.translations.find(t => t.to === 'de')?.text || '',
                    fr: translations[0]?.translations.find(t => t.to === 'fr')?.text || '',
                    ja: translations[0]?.translations.find(t => t.to === 'ja')?.text || ''
                };
            })
        );

        const extendedAnalysis: ExtendedAnalyzeImageResponse = {
            ...analysis,
            translatedDescriptions: {
                it: translatedDescriptions[0]?.translations.find(t => t.to === 'it')?.text || '',
                de: translatedDescriptions[0]?.translations.find(t => t.to === 'de')?.text || '',
                fr: translatedDescriptions[0]?.translations.find(t => t.to === 'fr')?.text || '',
                ja: translatedDescriptions[0]?.translations.find(t => t.to === 'ja')?.text || ''
            },
            translatedCategories,
            translatedTags
        };

        return extendedAnalysis;
    } catch (error) {
        const errorMessage = (error as any).response?.data?.message || (error as any).message || 'Errore sconosciuto';
        throw new Error(`Errore nell'analisi dell'immagine: ${errorMessage}`);
    }
};
