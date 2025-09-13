export interface AIProvider {
    generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string>;
    validateConfiguration(): Promise<boolean>;
}

export interface GenerationOptions {
    maxTokens?: number;
    style?: MessageStyle;
    customPrompt?: string;
    temperature?: number;
    systemPrompt?: string;
}

export type MessageStyle = 'conventional' | 'concise' | 'detailed' | 'custom';
export type Language = 'english' | 'chinese' | 'spanish' | 'french' | 'russian' | 'japanese' | 'korean' | 'vietnamese';

export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'mistral' | 'openrouter' | 'ollama' | 'lmstudio';

export interface ProviderConfig {
    type: ProviderType;
    apiKey?: string;
    model: string;
    baseUrl?: string;
}

export interface GitChanges {
    staged: string[];
    unstaged: string[];
    diff: string;
}

export interface SecretStorage {
    store(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | undefined>;
    delete(key: string): Promise<void>;
}