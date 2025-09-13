import * as vscode from 'vscode';
import { GitCommitService } from './services/gitCommitService';
import { AIProviderFactory } from './providers/aiProviderFactory';
import { ConfigurationManager } from './utils/configurationManager';
import { SecretManager } from './services/secretManager';

import { Logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext) {
    const configManager = new ConfigurationManager();
    const providerFactory = new AIProviderFactory(configManager, context);
    const gitCommitService = new GitCommitService(providerFactory, configManager);
    const secretManager = new SecretManager(context.secrets);

    const generateCommitCommand = vscode.commands.registerCommand(
        'universal-commit-assistant.generateCommitMessage',
        async () => {
            try {
                await gitCommitService.generateAndSetCommitMessage();
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Failed to generate commit message: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );

    const clearSecretsCommand = vscode.commands.registerCommand(
        'universal-commit-assistant.clearAllSecrets',
        async () => {
            try {
                await secretManager.clearAllSecrets();
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Failed to clear secrets: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );

    const openSettingsCommand = vscode.commands.registerCommand(
        'universal-commit-assistant.openSettings',
        () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'universal-commit-assistant');
        }
    );

    const showSecretStatusCommand = vscode.commands.registerCommand(
        'universal-commit-assistant.showSecretStatus',
        async () => {
            try {
                await secretManager.showSecretStatus();
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Failed to show secret status: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );

    context.subscriptions.push(
        generateCommitCommand,
        clearSecretsCommand,
        openSettingsCommand,
        showSecretStatusCommand
    );
}

export function deactivate() {
    Logger.getInstance().dispose();
}