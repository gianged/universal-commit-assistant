import axios from 'axios';
import { BaseProvider } from './baseProvider';
import { GenerationOptions } from '../types';
import { ConfigurationManager } from '../utils/configurationManager';

export class LMStudioProvider extends BaseProvider {
    constructor(private readonly configManager: ConfigurationManager) {
        super();
    }

    async generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string> {
        const baseUrl = this.configManager.getLMStudioBaseUrl();
        const model = this.configManager.getLMStudioModel();
        const temperature = this.configManager.getTemperature();
        const systemPrompt = this.configManager.getSystemPrompt();
        const style = options?.style || this.configManager.getMessageStyle();
        const language = this.configManager.getLanguage();
        const maxTokens = options?.maxTokens || (style === 'detailed' ? 300 : this.configManager.getMaxTokens());

        const prompt = this.buildPrompt(changes, style, options?.customPrompt, language);

        try {
            const response = await axios.post(
                `${baseUrl}/v1/chat/completions`,
                {
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: temperature
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const message = response.data.choices[0]?.message?.content;
            if (!message) {
                throw new Error('No response from LM Studio');
            }

            return this.validateResponse(message, style);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNREFUSED') {
                    throw new Error('Cannot connect to LM Studio. Make sure LM Studio is running and the server is started.');
                }
                throw new Error(`LM Studio error: ${error.response?.data?.error?.message || error.message}`);
            }
            throw error;
        }
    }

    async validateConfiguration(): Promise<boolean> {
        try {
            const baseUrl = this.configManager.getLMStudioBaseUrl();
            await axios.get(`${baseUrl}/v1/models`, { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}