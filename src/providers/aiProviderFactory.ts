import * as vscode from "vscode";

import { AIProvider } from "../types";
import { AnthropicProvider } from "./anthropicProvider";
import { ConfigurationManager } from "../utils/configurationManager";
import { DeepSeekProvider } from "./deepseekProvider";
import { GeminiProvider } from "./geminiProvider";
import { LMStudioProvider } from "./lmstudioProvider";
import { MistralProvider } from "./mistralProvider";
import { OllamaProvider } from "./ollamaProvider";
import { OpenAIProvider } from "./openaiProvider";
import { OpenRouterProvider } from "./openrouterProvider";
import { QwenProvider } from "./qwenProvider";

export class AIProviderFactory {
  constructor(
    private readonly configManager: ConfigurationManager,
    private readonly context: vscode.ExtensionContext
  ) {}

  async createProvider(): Promise<AIProvider> {
    const providerType = this.configManager.getProviderType();

    switch (providerType) {
      case "openai":
        return new OpenAIProvider(this.configManager, this.context.secrets);
      case "anthropic":
        return new AnthropicProvider(this.configManager, this.context.secrets);
      case "gemini":
        return new GeminiProvider(this.configManager, this.context.secrets);
      case "mistral":
        return new MistralProvider(this.configManager, this.context.secrets);
      case "deepseek":
        return new DeepSeekProvider(this.configManager, this.context.secrets);
      case "ollama":
        return new OllamaProvider(this.configManager);
      case "lmstudio":
        return new LMStudioProvider(this.configManager);
      case "openrouter":
        return new OpenRouterProvider(this.configManager, this.context.secrets);
      case "qwen":
        return new QwenProvider(this.configManager, this.context.secrets);
      default:
        throw new Error(`Unsupported provider type: ${providerType}`);
    }
  }
}
