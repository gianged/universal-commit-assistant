import axios from 'axios';
import * as vscode from 'vscode';
import { BaseProvider } from './baseProvider';
import { GenerationOptions } from '../types';
import { ConfigurationManager } from '../utils/configurationManager';

export class GeminiProvider extends BaseProvider {
    private readonly API_KEY_SECRET = 'universal-commit-assistant.gemini.apiKey';

    constructor(
        private readonly configManager: ConfigurationManager,
        private readonly secretStorage: vscode.SecretStorage
    ) {
        super();
    }

    async generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string> {
        const apiKey = await this.getApiKey();
        const model = this.configManager.getGeminiModel();
        const style = options?.style || this.configManager.getMessageStyle();
        const language = this.configManager.getLanguage();
        
        const prompt = this.buildPrompt(changes, style, options?.customPrompt, language);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const message = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!message) {
                throw new Error('No response from Gemini');
            }

            return this.validateResponse(message);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
            }
            throw error;
        }
    }

    async validateConfiguration(): Promise<boolean> {
        const apiKey = await this.getApiKey();
        return !!apiKey;
    }

    private async getApiKey(): Promise<string> {
        let apiKey = await this.secretStorage.get(this.API_KEY_SECRET);
        
        if (!apiKey) {
            apiKey = await vscode.window.showInputBox({
                prompt: 'Enter your Google Gemini API key',
                password: true,
                placeHolder: 'AIza...'
            });
            
            if (!apiKey) {
                throw new Error('Gemini API key is required');
            }
            
            await this.secretStorage.store(this.API_KEY_SECRET, apiKey);
        }
        
        return apiKey;
    }
}