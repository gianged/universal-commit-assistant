import * as vscode from "vscode";

import { BaseProvider } from "./baseProvider";
import { ConfigurationManager } from "../utils/configurationManager";
import { GenerationOptions } from "../types";
import axios from "axios";

export class AnthropicProvider extends BaseProvider {
  private readonly API_KEY_SECRET = "universal-commit-assistant.anthropic.apiKey";

  constructor(
    private readonly configManager: ConfigurationManager,
    private readonly secretStorage: vscode.SecretStorage
  ) {
    super();
  }

  async generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string> {
    const apiKey = await this.getApiKey();
    const model = this.configManager.getAnthropicModel();
    const temperature = this.configManager.getTemperature();
    const systemPrompt = this.configManager.getSystemPrompt();
    const style = options?.style || this.configManager.getMessageStyle();
    const language = this.configManager.getLanguage();
    const maxTokens = options?.maxTokens || (style === "detailed" ? 300 : this.configManager.getMaxTokens());

    const prompt = this.buildPrompt(changes, style, options?.customPrompt, language, options?.isFirstCommit);

    try {
      const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model,
          max_tokens: maxTokens,
          temperature: temperature,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
        }
      );

      const message = response.data.content[0]?.text;
      if (!message) {
        throw new Error("No response from Anthropic");
      }

      return this.validateResponse(message, style);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Anthropic API error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  async validateConfiguration(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return !!apiKey;
  }

  private async getApiKey(): Promise<string> {
    let apiKey = await this.secretStorage.get(this.API_KEY_SECRET);

    if (!apiKey) {
      apiKey = await vscode.window.showInputBox({
        prompt: "Enter your Anthropic API key",
        password: true,
        placeHolder: "sk-ant-...",
      });

      if (!apiKey) {
        throw new Error("Anthropic API key is required");
      }

      await this.secretStorage.store(this.API_KEY_SECRET, apiKey);
    }

    return apiKey;
  }
}
