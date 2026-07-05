import * as vscode from "vscode";

import { Language, MessageStyle, ProviderType } from "../types";

export class ConfigurationManager {
  private readonly EXTENSION_NAME = "universal-commit-assistant";

  private getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(this.EXTENSION_NAME);
  }

  getProviderType(): ProviderType {
    return this.getConfiguration().get("provider", "openai") as ProviderType;
  }

  getMessageStyle(): MessageStyle {
    return this.getConfiguration().get("messageStyle", "conventional") as MessageStyle;
  }

  getCustomPrompt(): string {
    return this.getConfiguration().get("customPrompt", "");
  }

  getMaxTokens(): number {
    return this.getConfiguration().get("maxTokens", 200);
  }

  getTemperature(): number {
    return this.getConfiguration().get("temperature", 0.3);
  }

  getSystemPrompt(): string {
    return this.getConfiguration().get(
      "systemPrompt",
      "You are a git commit message generator. Return ONLY the commit message with no additional text, explanations, or prefixes."
    );
  }

  getLanguage(): Language {
    return this.getConfiguration().get("language", "english") as Language;
  }

  getMaxDiffLength(): number {
    return this.getConfiguration().get("maxDiffLength", 100000);
  }

  getDetectFirstCommit(): boolean {
    return this.getConfiguration().get("detectFirstCommit", true);
  }

  getOpenAIModel(): string {
    return this.getConfiguration().get("openai.model", "gpt-5.4-mini");
  }

  getAnthropicModel(): string {
    return this.getConfiguration().get("anthropic.model", "claude-haiku-4-5");
  }

  getGeminiModel(): string {
    return this.getConfiguration().get("gemini.model", "gemini-3.1-flash-lite");
  }

  getMistralModel(): string {
    return this.getConfiguration().get("mistral.model", "mistral-small-latest");
  }

  getOllamaModel(): string {
    return this.getConfiguration().get("ollama.model", "qwen3.5:4b");
  }

  getOllamaBaseUrl(): string {
    return this.getConfiguration().get("ollama.baseUrl", "http://localhost:11434");
  }

  getLMStudioBaseUrl(): string {
    return this.getConfiguration().get("lmstudio.baseUrl", "http://localhost:1234");
  }

  getLMStudioModel(): string {
    return this.getConfiguration().get("lmstudio.model", "qwen/qwen3.5-9b");
  }

  getOpenRouterModel(): string {
    return this.getConfiguration().get("openrouter.model", "google/gemini-3.1-flash-lite");
  }

  getDeepSeekModel(): string {
    return this.getConfiguration().get("deepseek.model", "deepseek-v4-flash");
  }

}
