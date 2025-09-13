import * as vscode from 'vscode';
import { Logger } from './logger';

export interface RetryOptions {
    maxAttempts?: number;
    delayMs?: number;
    backoffMultiplier?: number;
}

export class RetryHandler {
    private static readonly DEFAULT_MAX_ATTEMPTS = 3;
    private static readonly DEFAULT_DELAY_MS = 1000;
    private static readonly DEFAULT_BACKOFF_MULTIPLIER = 1.5;

    private readonly logger = Logger.getInstance();

    async executeWithRetry<T>(
        operation: () => Promise<T>,
        operationName: string,
        options: RetryOptions = {}
    ): Promise<T> {
        const maxAttempts = options.maxAttempts ?? RetryHandler.DEFAULT_MAX_ATTEMPTS;
        const baseDelay = options.delayMs ?? RetryHandler.DEFAULT_DELAY_MS;
        const backoffMultiplier = options.backoffMultiplier ?? RetryHandler.DEFAULT_BACKOFF_MULTIPLIER;

        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                this.logger.info(`${operationName} - Attempt ${attempt}/${maxAttempts}`);
                
                const result = await operation();
                
                if (attempt > 1) {
                    this.logger.info(`${operationName} succeeded on attempt ${attempt}`);
                    vscode.window.showInformationMessage(`${operationName} succeeded after ${attempt} attempts`);
                }
                
                return result;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                
                this.logger.error(
                    `${operationName} failed on attempt ${attempt}/${maxAttempts}`,
                    lastError
                );

                if (attempt === maxAttempts) {
                    break;
                }

                const delay = baseDelay * Math.pow(backoffMultiplier, attempt - 1);
                this.logger.info(`Retrying ${operationName} in ${delay}ms...`);
                
                await this.delay(delay);
            }
        }

        const finalErrorMessage = `${operationName} failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`;
        this.logger.error(finalErrorMessage, lastError);
        
        vscode.window.showErrorMessage(
            `${operationName} failed after ${maxAttempts} attempts. Check output for details.`,
            'Show Logs'
        ).then(selection => {
            if (selection === 'Show Logs') {
                this.logger.show();
            }
        });

        throw new Error(finalErrorMessage);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}