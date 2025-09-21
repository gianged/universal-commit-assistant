import * as vscode from "vscode";

import { GitChanges } from "../types";
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

    for (const change of stagedChanges) {
      staged.push(`${this.getChangeType(change.status)} ${change.uri.fsPath}`);
    }

    if (includeUnstaged) {
      for (const change of unstagedChanges) {
        unstaged.push(`${this.getChangeType(change.status)} ${change.uri.fsPath}`);
      }
    }

    const diff = await this.getDiff(repository, includeUnstaged);

    return {
      staged,
      unstaged,
      diff,
    };
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
}
