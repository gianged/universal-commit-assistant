import axios from 'axios';
import * as vscode from 'vscode';
import { BaseProvider } from './baseProvider';
import { GenerationOptions } from '../types';
import { ConfigurationManager } from '../utils/configurationManager';

export class AnthropicProvider extends BaseProvider {
    private readonly API_KEY_SECRET = 'universal-commit-assistant.anthropic.apiKey';

    constructor(
        private readonly configManager: ConfigurationManager,
        private readonly secretStorage: vscode.SecretStorage
    ) {
        super();
    }

    async generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string> {
        const apiKey = await this.getApiKey();
        const model = this.configManager.getAnthropicModel();
        const maxTokens = options?.maxTokens || this.configManager.getMaxTokens();
        const style = options?.style || this.configManager.getMessageStyle();
        const language = this.configManager.getLanguage();
        
        const prompt = this.buildPrompt(changes, style, options?.customPrompt, language);

        try {
            const response = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model,
                    max_tokens: maxTokens,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                },
                {
                    headers: {
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json',
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            const message = response.data.content[0]?.text;
            if (!message) {
                throw new Error('No response from Anthropic');
            }

            return this.validateResponse(message);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Anthropic API error: ${error.response?.data?.error?.message || error.message}`);
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
                prompt: 'Enter your Anthropic API key',
                password: true,
                placeHolder: 'sk-ant-...'
            });
            
            if (!apiKey) {
                throw new Error('Anthropic API key is required');
            }
            
            await this.secretStorage.store(this.API_KEY_SECRET, apiKey);
        }
        
        return apiKey;
    }
}