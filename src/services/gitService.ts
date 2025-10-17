import * as vscode from "vscode";
import * as path from "node:path";

import { GitChanges, GitStatistics } from "../types";
import { Logger } from "../utils/logger";

export class GitService {
  async getChanges(includeUnstaged: boolean = true): Promise<GitChanges> {
    const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;
    if (!gitExtension) {
      throw new Error("Git extension not found");
    }

    const git = gitExtension.getAPI(1);
    if (!git) {
      throw new Error("Git API not available");
    }

    const repository = git.repositories[0];
    if (!repository) {
      throw new Error("No Git repository found");
    }

    const stagedChanges = repository.state.indexChanges;
    const unstagedChanges = repository.state.workingTreeChanges;

    const staged: string[] = [];
    const unstaged: string[] = [];
    const allChanges: any[] = [...stagedChanges];

    for (const change of stagedChanges) {
      staged.push(`${this.getChangeType(change.status)} ${change.uri.fsPath}`);
    }

    if (includeUnstaged) {
      allChanges.push(...unstagedChanges);
      for (const change of unstagedChanges) {
        unstaged.push(`${this.getChangeType(change.status)} ${change.uri.fsPath}`);
      }
    }

    const diff = await this.getDiff(repository, includeUnstaged);
    const statistics = this.calculateStatistics(diff, allChanges);

    return {
      staged,
      unstaged,
      diff,
      statistics,
    };
  }

  async isFirstCommit(): Promise<boolean> {
    try {
      const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;
      if (!gitExtension) {
        return false;
      }

      const git = gitExtension.getAPI(1);
      if (!git) {
        return false;
      }

      const repository = git.repositories[0];
      if (!repository) {
        return false;
      }

      return !repository.state.HEAD?.commit;
    } catch (error) {
      Logger.getInstance().error("Failed to check if first commit", error as Error);
      return false;
    }
  }

  private getChangeType(status: number): string {
    switch (status) {
      case 0:
        return "UNTRACKED";
      case 1:
        return "IGNORED";
      case 2:
        return "UNTRACKED";
      case 3:
        return "ADDED";
      case 4:
        return "DELETED";
      case 5:
        return "MODIFIED";
      case 6:
        return "RENAMED";
      case 7:
        return "COPIED";
      case 8:
        return "UPDATED_BUT_UNMERGED";
      case 9:
        return "MODIFIED";
      case 10:
        return "ADDED_BY_US";
      case 11:
        return "ADDED_BY_THEM";
      case 12:
        return "DELETED_BY_US";
      case 13:
        return "DELETED_BY_THEM";
      case 14:
        return "BOTH_ADDED";
      case 15:
        return "BOTH_DELETED";
      case 16:
        return "BOTH_MODIFIED";
      default:
        return "UNKNOWN";
    }
  }

  private async getDiff(repository: any, includeUnstaged: boolean): Promise<string> {
    try {
      let diff = "";

      if (repository.state.indexChanges.length > 0) {
        diff += await repository.diff(true);
      }

      if (includeUnstaged && repository.state.workingTreeChanges.length > 0) {
        if (diff) diff += "\n\n";
        diff += await repository.diff(false);
      }

      return diff || "No changes detected";
    } catch (error) {
      Logger.getInstance().error("Failed to generate diff", error as Error);
      return "Could not generate diff";
    }
  }

  private calculateStatistics(diff: string, changes: any[]): GitStatistics {
    let additions = 0;
    let deletions = 0;
    const fileTypes = new Map<string, number>();

    const lines = diff.split("\n");
    for (const line of lines) {
      if (line.startsWith("+") && !line.startsWith("+++")) {
        additions++;
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        deletions++;
      }
    }

    for (const change of changes) {
      const ext = this.getFileExtension(change.uri.fsPath);
      fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);
    }

    return {
      filesChanged: changes.length,
      additions,
      deletions,
      fileTypes,
    };
  }

  private getFileExtension(filePath: string): string {
    const ext = path.extname(filePath);
    if (!ext) return "no-extension";

    const extName = ext.substring(1).toLowerCase();

    const typeMapping: Record<string, string> = {
      js: "JavaScript",
      ts: "TypeScript",
      jsx: "React JSX",
      tsx: "React TSX",
      py: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      cs: "C#",
      go: "Go",
      rs: "Rust",
      php: "PHP",
      rb: "Ruby",
      swift: "Swift",
      kt: "Kotlin",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      json: "JSON",
      xml: "XML",
      yaml: "YAML",
      yml: "YAML",
      md: "Markdown",
      txt: "Text",
      sh: "Shell",
      sql: "SQL",
    };

    return typeMapping[extName] || extName;
  }

  smartTruncateDiff(diff: string, maxLength: number = 3000): string {
    if (diff.length <= maxLength) {
      return diff;
    }

    const lines = diff.split("\n");
    const preserveStart = Math.floor(maxLength * 0.4);
    const preserveEnd = Math.floor(maxLength * 0.3);
    const preserveMiddle = maxLength - preserveStart - preserveEnd;

    let result = "";
    let currentLength = 0;

    for (let i = 0; i < lines.length && currentLength < preserveStart; i++) {
      result += lines[i] + "\n";
      currentLength += lines[i].length + 1;
    }

    result += "\n... (middle section truncated for brevity) ...\n\n";

    const middleStart = Math.floor(lines.length / 3);
    const middleEnd = Math.floor((lines.length * 2) / 3);
    currentLength = 0;

    for (let i = middleStart; i < middleEnd && currentLength < preserveMiddle; i++) {
      if (lines[i].match(/^(diff|index|---|\+\+\+|@@)/)) {
        result += lines[i] + "\n";
        currentLength += lines[i].length + 1;
      }
    }

    result += "\n... (end section) ...\n\n";

    currentLength = 0;
    const endLines: string[] = [];
    for (let i = lines.length - 1; i >= 0 && currentLength < preserveEnd; i--) {
      endLines.unshift(lines[i]);
      currentLength += lines[i].length + 1;
    }

    result += endLines.join("\n");

    return result;
  }
}
