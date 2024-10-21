import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import axios from 'axios';
import { visionModel } from './vision.model';

const computerVisionKey = '7073a72433844cc6b2bc11e1634511f1';
const computerVisionEndpoint = 'https://serviziocognitivobobtv.cognitiveservices.azure.com/';

const translatorKey = '53f9cb70915b44659c1698eb516fd80f';
const translatorEndpoint = 'https://api.cognitive.microsofttranslator.com';
const translatorRegion = 'switzerlandnorth';

const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': computerVisionKey } }),
    computerVisionEndpoint
);

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

export const analyzeAndTranslateImages = async (languages: string[], imageFiles: string[]) => {
    for (const fileName of imageFiles) {
        const imageUrl = `https://testbobphp2.altervista.org/verifica_azure/${fileName}`;

        try {
            // Analisi dell'immagine con il servizio Azure Computer Vision
            const analysis = await computerVisionClient.analyzeImage(imageUrl, {
                visualFeatures: ['Description', 'Tags']
            });

            const descriptionText = analysis.description?.captions?.[0]?.text || 'Nessuna descrizione disponibile';
            const tags = (analysis.tags || []).map(tag => tag.name);

            // Traduzione della descrizione
            const translatedDescriptions = await translateText(descriptionText, languages);
            if (!translatedDescriptions || translatedDescriptions.length === 0) {
                throw new Error('Errore nella traduzione della descrizione.');
            }

            // Traduzione dei tag
            const translatedTags = await Promise.all(tags.map(async tag => {
                try {
                    const translations = await translateText(tag!, languages);
                    return translations;
                } catch {
                    console.warn(`Impossibile tradurre il tag "${tag}"`);
                    return [];
                }
            }));

            // Creazione e salvataggio dei record nel database
            for (const lang of languages) {
                const descriptionTranslation = translatedDescriptions[0]?.translations.find(t => t.to === lang)?.text || '';
                const tagTranslations = translatedTags.map(t => t[0]?.translations.find(tr => tr.to === lang)?.text || '');

                if (!descriptionTranslation) {
                    console.warn(`Traduzione mancante per la descrizione in lingua "${lang}"`);
                }

                const imageAnalysisRecord = new visionModel({
                    fileName,
                    language: lang,
                    description: descriptionTranslation,
                    tags: tagTranslations
                });

                await imageAnalysisRecord.save();
            }
        } catch (error) {
            console.error(`Errore nell'analisi dell'immagine ${fileName}:`, error);
            throw new Error(`Errore nell'analisi dell'immagine ${fileName}`);
        }
    }
};
