import { AIProvider, GenerationOptions, Language, MessageStyle } from "../types";

import { Logger } from "../utils/logger";

export abstract class BaseProvider implements AIProvider {
  abstract generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string>;
  abstract validateConfiguration(): Promise<boolean>;

  protected buildPrompt(
    changes: string,
    style: MessageStyle,
    customPrompt?: string,
    language: Language = "english"
  ): string {
    if (style === "custom" && customPrompt) {
      return customPrompt.replace("{changes}", changes);
    }

    const languageInstructions = this.getLanguageInstructions(language, style);
    const basePrompt = `Based on the following git changes, generate a commit message:\\n\\n${changes}\\n\\n`;

    switch (style) {
      case "conventional":
        return (
          basePrompt +
          `Generate a conventional commit message using the format: type(scope): description. Use these common types: feat (new feature), fix (bug fix), docs (documentation), style (formatting), refactor (code restructuring), test (testing), chore (maintenance), build (build system), ci (continuous integration), perf (performance), revert (revert changes). Scope is optional but helpful. Use imperative mood (e.g., "add" not "added"). Keep under 72 characters. Examples: "feat(auth): add user login validation" or "fix: resolve database connection timeout". ${languageInstructions}`
        );
      case "concise":
        return (
          basePrompt +
          `Generate a concise, direct commit message without type prefix. Use imperative mood and focus on the most important change. Target 50-60 characters but prioritize clarity over strict length limits. Examples: "Add user authentication system" or "Fix login validation bug". ${languageInstructions}`
        );
      case "detailed":
        return (
          basePrompt +
          `Generate a detailed commit message with this exact structure:
Line 1: Conventional format title under 72 characters (type(scope): description)
Line 2: Blank line  
Line 3+: Detailed explanation covering what changed, why it was changed, and the impact. Use bullet points for multiple specific changes.

Example format:
feat(auth): implement OAuth2 login system

- Add OAuth2 authentication flow with Google and GitHub providers
- Create user session management with JWT tokens  
- Implement role-based access control for admin features
- Update login UI with provider selection buttons

This change improves security and provides users with convenient social login options while maintaining backward compatibility with email/password authentication. ${languageInstructions}`
        );
      default:
        return basePrompt + `Generate an appropriate commit message using best practices. ${languageInstructions}`;
    }
  }

  private getLanguageInstructions(language: Language, style: MessageStyle): string {
    if (language === "english") {
      return "Respond in English. Use imperative mood like 'add', 'fix', 'update'.";
    }

    const styleNote =
      style === "conventional" || style === "detailed"
        ? " Keep type prefixes (feat, fix, docs, etc.) in English for tooling compatibility, but translate the description."
        : "";

    switch (language) {
      case "spanish":
        return `Respond in Spanish (Español). Use infinitive or imperative forms like 'añadir', 'corregir', 'actualizar'.${styleNote}`;
      case "french":
        return `Respond in French (Français). Use infinitive forms like 'ajouter', 'corriger', 'mettre à jour'.${styleNote}`;
      case "chinese":
        return `Respond in Chinese (中文). Use action-oriented verbs like '添加', '修复', '更新'.${styleNote}`;
      case "russian":
        return `Respond in Russian (Русский). Use infinitive forms like 'добавить', 'исправить', 'обновить'.${styleNote}`;
      case "vietnamese":
        return `Respond in Vietnamese (Tiếng Việt). Use action verbs like 'thêm', 'sửa', 'cập nhật'.${styleNote}`;
      case "japanese":
        return `Respond in Japanese (日本語). Use verb forms like '追加', '修正', '更新' with appropriate particles.${styleNote}`;
      case "korean":
        return `Respond in Korean (한국어). Use action verbs like '추가', '수정', '업데이트'.${styleNote}`;
      default:
        return "Respond in English. Use imperative mood like 'add', 'fix', 'update'.";
    }
  }

  protected validateResponse(response: string, style: MessageStyle): string {
    const finalResult = response.trim();

    if (!finalResult) {
      const error = new Error("Empty response from AI provider");
      Logger.getInstance().error("AI provider returned empty response", error);
      throw error;
    }

    if (style === "detailed") {
      return this.validateDetailedResult(finalResult);
    } else {
      return this.validateStandardResult(finalResult);
    }
  }

  private validateStandardResult(result: string): string {
    const MAX_LENGTH = 200;
    if (result.length > MAX_LENGTH) {
      Logger.getInstance().warn(`AI response truncated from ${result.length} to ${MAX_LENGTH} characters`);
      return result.substring(0, MAX_LENGTH).trim();
    }

    Logger.getInstance().info(`AI response validated successfully: "${result}"`);
    return result;
  }

  private validateDetailedResult(result: string): string {
    const MAX_LENGTH = 1000;
    if (result.length > MAX_LENGTH) {
      Logger.getInstance().warn(`AI response truncated from ${result.length} to ${MAX_LENGTH} characters`);
      const truncated = result.substring(0, MAX_LENGTH);
      const lastNewline = truncated.lastIndexOf("\n");
      return lastNewline > 0 ? truncated.substring(0, lastNewline).trim() : truncated.trim();
    }

    Logger.getInstance().info(`AI detailed response validated successfully: ${result.split("\n").length} lines`);
    return result;
  }
}
