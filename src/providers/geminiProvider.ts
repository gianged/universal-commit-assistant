import * as vscode from "vscode";

import { BaseProvider } from "./baseProvider";
import { ConfigurationManager } from "../utils/configurationManager";
import { GenerationOptions } from "../types";
import axios from "axios";

export class GeminiProvider extends BaseProvider {
  private readonly API_KEY_SECRET = "universal-commit-assistant.gemini.apiKey";

  constructor(
    private readonly configManager: ConfigurationManager,
    private readonly secretStorage: vscode.SecretStorage
  ) {
    super();
  }
  async generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string> {
    const apiKey = await this.getApiKey();
    const model = this.configManager.getGeminiModel();
    const temperature = this.configManager.getTemperature();
    const systemPrompt = this.configManager.getSystemPrompt();
    const style = options?.style || this.configManager.getMessageStyle();
    const language = this.configManager.getLanguage();

    const userPrompt = this.buildPrompt(changes, style, options?.customPrompt, language);
    const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}\n\nPlease respond with ONLY the commit message, no explanations or additional text.`;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: temperature,
          },
        },
        {
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      const message = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!message) {
        throw new Error("No response from Gemini");
      }

      return this.validateResponse(message, style);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
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
        prompt: "Enter your Google Gemini API key",
        password: true,
        placeHolder: "AIza...",
      });

      if (!apiKey) {
        throw new Error("Gemini API key is required");
      }

      await this.secretStorage.store(this.API_KEY_SECRET, apiKey);
    }

    return apiKey;
  }
}
