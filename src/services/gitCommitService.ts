import * as vscode from 'vscode';
import { AIProviderFactory } from '../providers/aiProviderFactory';
import { ConfigurationManager } from '../utils/configurationManager';
import { GitService } from './gitService';

import { Logger } from '../utils/logger';
import { RetryHandler } from '../utils/retryHandler';

export class GitCommitService {
    private readonly gitService: GitService;
    private readonly logger = Logger.getInstance();
    private readonly retryHandler = new RetryHandler();

    constructor(
        private readonly providerFactory: AIProviderFactory,
        private readonly configManager: ConfigurationManager
    ) {
        this.gitService = new GitService();
    }

    async generateAndSetCommitMessage(): Promise<void> {
        try {
            await this.retryHandler.executeWithRetry(
                () => this.performCommitMessageGeneration(),
                'Commit message generation',
                { maxAttempts: 3, delayMs: 1000, backoffMultiplier: 1.5 }
            );
        } catch (error) {
            this.logger.error('Failed to generate commit message after all retries', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    private async performCommitMessageGeneration(): Promise<void> {
        const includeUnstaged = this.configManager.getIncludeUnstaged();
        
        return new Promise((resolve, reject) => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Generating commit message...",
                cancellable: false
            }, async (progress) => {
                try {
                    progress.report({ increment: 20, message: "Getting git changes..." });
                    
                    const changes = await this.gitService.getChanges(includeUnstaged);
                    
                    if (changes.staged.length === 0 && (!includeUnstaged || changes.unstaged.length === 0)) {
                        throw new Error('No changes found to commit');
                    }

                    progress.report({ increment: 40, message: "Preparing AI provider..." });
                    
                    const provider = await this.providerFactory.createProvider();
                    
                    const isConfigValid = await provider.validateConfiguration();
                    if (!isConfigValid) {
                        throw new Error('Provider configuration is invalid. Please check your settings.');
                    }

                    progress.report({ increment: 60, message: "Generating commit message..." });
                    
                    const changesText = this.formatChanges(changes);
                    const commitMessage = await provider.generateCommitMessage(changesText, {
                        style: this.configManager.getMessageStyle(),
                        maxTokens: this.configManager.getMaxTokens(),
                        customPrompt: this.configManager.getCustomPrompt(),
                        temperature: this.configManager.getTemperature(),
                        systemPrompt: this.configManager.getSystemPrompt()
                    });

                    progress.report({ increment: 80, message: "Setting commit message..." });
                    
                    await this.setCommitMessage(commitMessage);
                    
                    progress.report({ increment: 100, message: "Complete!" });
                    
                    this.logger.info(`Commit message generated successfully: "${commitMessage}"`);
                    vscode.window.showInformationMessage(`Commit message generated: "${commitMessage}"`);
                    
                    resolve();
                } catch (error) {
                    const errorObj = error instanceof Error ? error : new Error(String(error));
                    this.logger.error('Error during commit message generation', errorObj);
                    reject(errorObj);
                }
            });
        });
    }

    private formatChanges(changes: any): string {
        let formatted = '';

        if (changes.staged.length > 0) {
            formatted += 'Staged changes:\n';
            formatted += changes.staged.map((change: string) => `  ${change}`).join('\n');
            formatted += '\n\n';
        }

        if (changes.unstaged.length > 0) {
            formatted += 'Unstaged changes:\n';
            formatted += changes.unstaged.map((change: string) => `  ${change}`).join('\n');
            formatted += '\n\n';
        }

        if (changes.diff && changes.diff !== 'No changes detected') {
            formatted += 'Diff:\n';
            formatted += changes.diff.substring(0, 2000);
            if (changes.diff.length > 2000) {
                formatted += '\n... (truncated)';
            }
        }

        return formatted;
    }

    private async setCommitMessage(message: string): Promise<void> {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        if (!gitExtension) {
            throw new Error('Git extension not found');
        }

        const git = gitExtension.getAPI(1);
        if (!git) {
            throw new Error('Git API not available');
        }

        const repository = git.repositories[0];
        if (!repository) {
            throw new Error('No Git repository found');
        }

        repository.inputBox.value = message;
    }
}