import * as vscode from "vscode";

import { BaseProvider } from "./baseProvider";
import { ConfigurationManager } from "../utils/configurationManager";
import { type GenerationOptions } from "../types";
import axios from "axios";

/**
 * Qwen AI provider using Alibaba Cloud DashScope API.
 * Uses OpenAI-compatible API format for seamless integration.
 */
export class QwenProvider extends BaseProvider {
  private readonly API_KEY_SECRET = "universal-commit-assistant.qwen.apiKey";

  constructor(
    private readonly configManager: ConfigurationManager,
    private readonly secretStorage: vscode.SecretStorage
  ) {
    super();
  }

  /**
   * Generates a commit message using Qwen models via DashScope API.
   * @param changes - Git diff changes to analyze
   * @param options - Optional generation parameters
   * @returns Generated commit message
   */
  async generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string> {
    const apiKey = await this.getApiKey();
    const model = this.configManager.getQwenModel();
    const baseUrl = this.configManager.getQwenBaseUrl();
    const temperature = this.configManager.getTemperature();
    const systemPrompt = this.configManager.getSystemPrompt();
    const style = options?.style || this.configManager.getMessageStyle();
    const language = this.configManager.getLanguage();
    const maxTokens = options?.maxTokens || (style === "detailed" ? 300 : this.configManager.getMaxTokens());

    const prompt = this.buildPrompt(changes, style, options?.customPrompt, language, options?.isFirstCommit);

    try {
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
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
        throw new Error("No response from Qwen");
      }

      return this.validateResponse(message, style);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Qwen API error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Validates that the provider is properly configured.
   * @returns True if API key is available
   */
  async validateConfiguration(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return !!apiKey;
  }

  /**
   * Retrieves the API key from secret storage, prompting user if not found.
   * @returns The API key string
   */
  private async getApiKey(): Promise<string> {
    let apiKey = await this.secretStorage.get(this.API_KEY_SECRET);

    if (!apiKey) {
      apiKey = await vscode.window.showInputBox({
        prompt: "Enter your Qwen (DashScope) API key",
        password: true,
        placeHolder: "sk-...",
      });

      if (!apiKey) {
        throw new Error("Qwen API key is required");
      }

      await this.secretStorage.store(this.API_KEY_SECRET, apiKey);
    }

    return apiKey;
  }
}
