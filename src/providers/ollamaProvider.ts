import { BaseProvider } from "./baseProvider";
import { ConfigurationManager } from "../utils/configurationManager";
import { GenerationOptions } from "../types";
import axios from "axios";

export class OllamaProvider extends BaseProvider {
  constructor(private readonly configManager: ConfigurationManager) {
    super();
  }

  async generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string> {
    const baseUrl = this.configManager.getOllamaBaseUrl();
    const model = this.configManager.getOllamaModel();
    const temperature = this.configManager.getTemperature();
    const systemPrompt = this.configManager.getSystemPrompt();
    const style = options?.style || this.configManager.getMessageStyle();
    const language = this.configManager.getLanguage();

    const userPrompt = this.buildPrompt(changes, style, options?.customPrompt, language, options?.isFirstCommit);
    const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}\n\nPlease respond with ONLY the commit message, no explanations or additional text.`;

    try {
      const response = await axios.post(
        `${baseUrl}/api/generate`,
        {
          model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: temperature,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      const message = response.data.response;
      if (!message) {
        throw new Error("No response from Ollama");
      }

      return this.validateResponse(message, style);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          throw new Error("Cannot connect to Ollama. Make sure Ollama is running and accessible.");
        }
        throw new Error(`Ollama error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  async validateConfiguration(): Promise<boolean> {
    try {
      const baseUrl = this.configManager.getOllamaBaseUrl();
      await axios.get(`${baseUrl}/api/version`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
