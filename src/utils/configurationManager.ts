import * as vscode from 'vscode';
import { MessageStyle, ProviderType, Language } from '../types';

export class ConfigurationManager {
    private readonly EXTENSION_NAME = 'universal-commit-assistant';

    private getConfiguration(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration(this.EXTENSION_NAME);
    }

    getProviderType(): ProviderType {
        return this.getConfiguration().get('provider', 'openai') as ProviderType;
    }

    getIncludeUnstaged(): boolean {
        return this.getConfiguration().get('includeUnstaged', true);
    }

    getMessageStyle(): MessageStyle {
        return this.getConfiguration().get('messageStyle', 'conventional') as MessageStyle;
    }

    getCustomPrompt(): string {
        return this.getConfiguration().get('customPrompt', '');
    }

    getMaxTokens(): number {
        return this.getConfiguration().get('maxTokens', 200);
    }

    getTemperature(): number {
        return this.getConfiguration().get('temperature', 0.3);
    }

    getSystemPrompt(): string {
        return this.getConfiguration().get('systemPrompt', 'You are a git commit message generator. Return ONLY the commit message with no additional text, explanations, or prefixes.');
    }

    getLanguage(): Language {
        return this.getConfiguration().get('language', 'english') as Language;
    }

    getEnableAnalytics(): boolean {
        return this.getConfiguration().get('enableAnalytics', false);
    }

    getOpenAIModel(): string {
        return this.getConfiguration().get('openai.model', 'gpt-4o-mini');
    }

    getAnthropicModel(): string {
        return this.getConfiguration().get('anthropic.model', 'claude-3-5-haiku-20241022');
    }

    getGeminiModel(): string {
        return this.getConfiguration().get('gemini.model', 'gemini-1.5-flash');
    }

    getMistralModel(): string {
        return this.getConfiguration().get('mistral.model', 'mistral-small-latest');
    }

    getOllamaModel(): string {
        return this.getConfiguration().get('ollama.model', 'llama3.2');
    }

    getOllamaBaseUrl(): string {
        return this.getConfiguration().get('ollama.baseUrl', 'http://localhost:11434');
    }

    getLMStudioBaseUrl(): string {
        return this.getConfiguration().get('lmstudio.baseUrl', 'http://localhost:1234');
    }

    getLMStudioModel(): string {
        return this.getConfiguration().get('lmstudio.model', 'llama-3.1-8b-instruct');
    }

    getOpenRouterModel(): string {
        return this.getConfiguration().get('openrouter.model', 'openai/gpt-4o-mini');
    }

    getDeepSeekModel(): string {
        return this.getConfiguration().get('deepseek.model', 'deepseek-chat');
    }

    async updateConfiguration(key: string, value: any, target?: vscode.ConfigurationTarget): Promise<void> {
        const config = this.getConfiguration();
        await config.update(key, value, target || vscode.ConfigurationTarget.Global);
    }
}