import * as vscode from "vscode";

import { BaseProvider } from "./baseProvider";
import { ConfigurationManager } from "../utils/configurationManager";
import { GenerationOptions } from "../types";
import axios from "axios";

export class MistralProvider extends BaseProvider {
  private readonly API_KEY_SECRET = "universal-commit-assistant.mistral.apiKey";

  constructor(
    private readonly configManager: ConfigurationManager,
    private readonly secretStorage: vscode.SecretStorage
  ) {
    super();
  }

  async generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string> {
    const apiKey = await this.getApiKey();
    const model = this.configManager.getMistralModel();
    const temperature = this.configManager.getTemperature();
    const systemPrompt = this.configManager.getSystemPrompt();
    const style = options?.style || this.configManager.getMessageStyle();
    const language = this.configManager.getLanguage();
    const maxTokens = options?.maxTokens || (style === "detailed" ? 300 : this.configManager.getMaxTokens());

    const prompt = this.buildPrompt(changes, style, options?.customPrompt, language);

    try {
      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: maxTokens,
          temperature: temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const message = response.data.choices[0]?.message?.content;
      if (!message) {
        throw new Error("No response from Mistral");
      }

      return this.validateResponse(message, style);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Mistral API error: ${error.response?.data?.error?.message || error.message}`);
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
        prompt: "Enter your Mistral API key",
        password: true,
        placeHolder: "Enter Mistral API key...",
      });

      if (!apiKey) {
        throw new Error("Mistral API key is required");
      }

      await this.secretStorage.store(this.API_KEY_SECRET, apiKey);
    }

    return apiKey;
  }
}
