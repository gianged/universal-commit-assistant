import * as vscode from "vscode";

export class Logger {
  private static instance: Logger;
  private readonly outputChannel: vscode.OutputChannel;

  private constructor() {
    this.outputChannel = vscode.window.createOutputChannel("Universal Commit Assistant");
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  error(message: string, error?: Error): void {
    const timestamp = new Date().toISOString();
    const errorDetails = error ? `\nError: ${error.message}\nStack: ${error.stack}` : "";
    const logMessage = `[ERROR] ${timestamp}: ${message}${errorDetails}`;

    this.outputChannel.appendLine(logMessage);
    console.error(logMessage);
  }

  info(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO] ${timestamp}: ${message}`;

    this.outputChannel.appendLine(logMessage);
    console.log(logMessage);
  }

  warn(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[WARN] ${timestamp}: ${message}`;

    this.outputChannel.appendLine(logMessage);
    console.warn(logMessage);
  }

  show(): void {
    this.outputChannel.show();
  }

  dispose(): void {
    this.outputChannel.dispose();
  }
}
