import { AIProvider, GenerationOptions, Language, MessageStyle } from "../types";

import { Logger } from "../utils/logger";

export abstract class BaseProvider implements AIProvider {
  abstract generateCommitMessage(changes: string, options?: GenerationOptions): Promise<string>;
  abstract validateConfiguration(): Promise<boolean>;

  protected buildPrompt(
    changes: string,
    style: MessageStyle,
    customPrompt?: string,
    language: Language = "english",
    isFirstCommit: boolean = false
  ): string {
    if (style === "custom" && customPrompt) {
      return customPrompt.replace("{changes}", changes);
    }

    const languageInstructions = this.getLanguageInstructions(language, style);

    if (isFirstCommit) {
      return `This is the FIRST COMMIT in a new repository. Based on the following initial files and project structure, generate an appropriate initial commit message:\\n\\n${changes}\\n\\nGenerate a commit message that describes what the project is being initialized with. Use the format "chore: initialize project with [brief description]" or "feat: initial project setup with [key components]". Focus on what type of project this is and what key components are being added. ${languageInstructions}`;
    }

    const basePrompt = `Based on the following git changes, generate a commit message:\\n\\n${changes}\\n\\n`;

    switch (style) {
      case "conventional":
        return (
          basePrompt +
          `Generate a conventional commit message following the Conventional Commits specification:

Format: type(scope): description

Required types (use the most appropriate):
- feat: New feature or functionality
- fix: Bug fix or error correction
- docs: Documentation changes only
- style: Code style/formatting changes (no logic change)
- refactor: Code restructuring without changing functionality
- test: Adding or updating tests
- chore: Maintenance tasks, dependency updates
- build: Build system or external dependency changes
- ci: CI/CD configuration changes
- perf: Performance improvements
- revert: Revert a previous commit

Guidelines:
1. Use imperative mood: "add" not "added", "fix" not "fixed"
2. Keep subject line under 72 characters (ideally 50)
3. Scope is optional but helpful (e.g., "feat(auth): add login")
4. Focus on WHY the change was made, not just WHAT changed
5. Be specific and concise

Examples:
- "feat(auth): add JWT token validation middleware"
- "fix: resolve null pointer in user profile loader"
- "docs(api): update authentication endpoint examples"
- "refactor(database): optimize query performance"

${languageInstructions}`
        );
      case "concise":
        return (
          basePrompt +
          `Generate a concise, direct commit message without type prefix.

Guidelines:
1. Use imperative mood: "Add", "Fix", "Update" (not "Added", "Fixed", "Updated")
2. Target 50-60 characters but prioritize clarity
3. Focus on the most important change
4. Be specific about what was changed
5. Avoid generic messages like "update code" or "fix bug"

Good examples:
- "Add user authentication with OAuth2"
- "Fix database connection timeout issue"
- "Update API response format to include metadata"
- "Remove deprecated payment gateway integration"

${languageInstructions}`
        );
      case "detailed":
        return (
          basePrompt +
          `Generate a detailed commit message with this EXACT structure:

Line 1: Conventional format title under 72 characters (type(scope): description)
Line 2: Blank line
Line 3+: Detailed explanation covering:
  - WHAT changed (specific changes)
  - WHY it was changed (motivation, context)
  - Impact or consequences of the change

Use bullet points for multiple specific changes.

Example format:
feat(auth): implement OAuth2 authentication system

- Add OAuth2 flow with Google and GitHub providers
- Create JWT-based session management with refresh tokens
- Implement role-based access control (RBAC) middleware
- Add user profile synchronization from OAuth providers
- Update login UI with provider selection

This change improves security by leveraging established OAuth2 providers
and provides users with convenient social login options. Maintains
backward compatibility with existing email/password authentication.

Guidelines:
1. Subject line: imperative mood, under 72 chars
2. Body: explain context and reasoning, not just what changed
3. Use bullet points for clarity
4. Wrap body text at 72 characters
5. Focus on WHY this change matters

${languageInstructions}`
        );
      default:
        return (
          basePrompt +
          `Generate an appropriate commit message using conventional commits best practices. Use imperative mood, be specific, and focus on the purpose of the change. ${languageInstructions}`
        );
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
