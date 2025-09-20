import * as vscode from 'vscode';

export class SecretManager {
    private readonly SECRET_KEYS = [
        'universal-commit-assistant.openai.apiKey',
        'universal-commit-assistant.anthropic.apiKey',
        'universal-commit-assistant.gemini.apiKey',
        'universal-commit-assistant.mistral.apiKey',
        'universal-commit-assistant.deepseek.apiKey',
        'universal-commit-assistant.openrouter.apiKey'
    ];

    constructor(private readonly secretStorage: vscode.SecretStorage) {}

    async clearAllSecrets(): Promise<void> {
        const confirmationMessage = 'This will clear all stored API keys. You will need to re-enter them when using the extension. Continue?';

        const result = await vscode.window.showWarningMessage(
            confirmationMessage,
            { modal: true },
            'Clear All Keys',
            'Cancel'
        );

        if (result === 'Clear All Keys') {
            const promises = this.SECRET_KEYS.map(key => this.secretStorage.delete(key));
            await Promise.all(promises);

            vscode.window.showInformationMessage('All API keys have been cleared successfully.');
        }
    }

    async getStoredSecrets(): Promise<{ [key: string]: boolean }> {
        const secretStatus: { [key: string]: boolean } = {};

        for (const key of this.SECRET_KEYS) {
            const value = await this.secretStorage.get(key);
            secretStatus[key] = !!value;
        }

        return secretStatus;
    }

    async showSecretStatus(): Promise<void> {
        const secrets = await this.getStoredSecrets();
        const items = Object.entries(secrets).map(([key, hasValue]) => {
            const provider = key.split('.')[1];
            const status = hasValue ? '✅ Stored' : '❌ Not set';
            return `${provider.toUpperCase()}: ${status}`;
        });

        const statusMessage = items.join('\n');

        const result = await vscode.window.showInformationMessage(
            `API Key Status:\n\n${statusMessage}`,
            { modal: true },
            'Clear All Keys',
            'Close'
        );

        if (result === 'Clear All Keys') {
            await this.clearAllSecrets();
        }
    }

    async clearSpecificSecret(provider: string): Promise<void> {
        const key = `universal-commit-assistant.${provider}.apiKey`;
        await this.secretStorage.delete(key);
        vscode.window.showInformationMessage(`${provider.toUpperCase()} API key has been cleared.`);
    }
}