import { AIProvider, GenerationOptions, MessageStyle, Language } from '../types';

import { Logger } from '../utils/logger';

export abstract class BaseProvider implements AIProvider {
    abstract generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string>;
    abstract validateConfiguration(): Promise<boolean>;

    protected buildPrompt(changes: string, style: MessageStyle, customPrompt?: string, language: Language = 'english'): string {
        if (style === 'custom' && customPrompt) {
            return customPrompt.replace('{changes}', changes);
        }

        const languageInstructions = this.getLanguageInstructions(language);
        const basePrompt = `Based on the following git changes, generate a commit message:\\n\\n${changes}\\n\\n`;
        
        switch (style) {
            case 'conventional':
                return basePrompt + `Use conventional commits format (type: description). Keep it concise and clear. ${languageInstructions}`;
            case 'concise':
                return basePrompt + `Generate a short, concise commit message (max 50 characters). ${languageInstructions}`;
            case 'detailed':
                return basePrompt + `Generate a detailed commit message explaining what was changed and why. ${languageInstructions}`;
            default:
                return basePrompt + `Generate an appropriate commit message. ${languageInstructions}`;
        }
    }

    private getLanguageInstructions(language: Language): string {
        switch (language) {
            case 'spanish':
                return 'Respond in Spanish (Español).';
            case 'french':
                return 'Respond in French (Français).';
            case 'chinese':
                return 'Respond in Chinese (中文).';
            case 'russian':
                return 'Respond in Russian (Русский).';
            case 'vietnamese':
                return 'Respond in Vietnamese (Tiếng Việt).';
            case 'japanese':
                return 'Respond in Japanese (日本語).';
            case 'korean':
                return 'Respond in Korean (한국어).';
            case 'english':
            default:
                return 'Respond in English.';
        }
    }

    protected validateResponse(response: string): string {
        const cleaned = response.trim().replace(/(^["']|["']$)/g, '');
        
        if (!cleaned) {
            const error = new Error('Empty response from AI provider');
            Logger.getInstance().error('AI provider returned empty response', error);
            throw error;
        }
        
        if (cleaned.length > 200) {
            Logger.getInstance().warn(`AI response truncated from ${cleaned.length} to 200 characters`);
            return cleaned.substring(0, 200).trim();
        }
        
        Logger.getInstance().info(`AI response validated successfully: "${cleaned}"`);
        return cleaned;
    }
}