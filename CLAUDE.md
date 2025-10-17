# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Universal Commit Assistant** is a VS Code extension that generates AI-powered commit messages using multiple AI providers. The extension supports 8 languages and follows modern TypeScript development practices with automated release workflows.

## Latest Updates (January 2025)

- **DeepSeek Provider Added**: Integration with DeepSeek-V3.1 models including deepseek-chat (fast general purpose) and deepseek-reasoner (thinking mode for complex tasks)
- **Enhanced Model Support**: Updated to support latest AI models from all major providers

## Development Commands

```bash
# Install dependencies
npm install

# Development builds
npm run compile      # TypeScript compilation for development
npm run watch        # Watch mode for TypeScript compilation

# Production builds
npm run package      # Webpack production build (used for publishing)
npm run vscode:prepublish  # Pre-publish build step

# Release and testing
npm run semantic-release # Automated release (CI/CD)
npm run release:dry-run  # Test release process without publishing

# Extension development
# Press F5 in VS Code to launch Extension Development Host with extension loaded
# Use Ctrl+Shift+P and run "Developer: Reload Window" to reload extension during development
```

## Architecture Overview

This is a VS Code extension called Universal Commit Assistant that generates AI-powered commit messages using multiple AI providers and supports 8 languages. As of January 2025, it supports 8 providers including the newly added DeepSeek provider.

### Core Architecture Pattern

The extension follows a **Provider Factory Pattern** with clear separation of concerns:

1. **AIProviderFactory** creates provider instances based on user configuration
2. **GitCommitService** orchestrates the workflow: git analysis → AI generation → commit message setting
3. **ConfigurationManager** centralizes all VS Code settings access
4. **SecretManager** handles secure API key storage and management with batch operations

### Command System

The extension registers four VS Code commands:

- `generateCommitMessage` - Main functionality with sparkle icon in SCM panel
- `clearAllSecrets` - Batch clear all stored API keys
- `openSettings` - Quick access to extension settings
- `showSecretStatus` - Display API key configuration status

### Provider System

All AI providers inherit from **BaseProvider** abstract class and implement:

- `generateCommitMessage(changes, options)` - Core AI interaction
- `validateConfiguration()` - Provider setup validation

Provider types:

- **Cloud providers** (OpenAI, Anthropic, Gemini, Mistral, DeepSeek, OpenRouter) - require API keys stored in VS Code secrets
- **Local providers** (Ollama, LM Studio) - require running local servers, configurable base URLs

Each provider implements standardized error handling and configuration validation to ensure robust operation.

### Key Architectural Decisions

**Configuration Strategy**: All settings use prefix `universal-commit-assistant.*` with provider-specific sub-namespaces (e.g., `universal-commit-assistant.openai.model`). Temperature, system prompts, and language selection are global settings applied to all providers. The extension supports four message styles: conventional, concise, detailed, and custom.

**Security Model**: API keys are stored in VS Code's SecretStorage, never in configuration. SecretManager provides batch operations for clearing all keys and status checking. The extension includes optional usage analytics with no sensitive data collection.

**Git Integration**: Uses VS Code's built-in Git API through `vscode.extensions.getExtension('vscode.git')`. Supports both staged and unstaged changes analysis with user-configurable inclusion settings.

**Error Handling**: Provider errors are caught and displayed as VS Code error messages. Configuration validation prevents runtime API failures. Each provider implements comprehensive error handling for network issues, API limits, and invalid configurations.

**Multi-language Support**: Supports 8 languages with proper localization for commit message generation: English, Chinese, Spanish, French, Russian, Japanese, Korean, and Vietnamese.

## Extension Structure

```
src/
├── extension.ts           # Entry point - registers all commands
├── types/index.ts         # Core TypeScript interfaces
├── providers/            # AI provider implementations
│   ├── aiProviderFactory.ts   # Factory for creating provider instances
│   ├── baseProvider.ts        # Abstract base class
│   ├── anthropicProvider.ts   # Claude 3.5 Haiku/Sonnet
│   ├── deepseekProvider.ts    # DeepSeek V3.1 models
│   ├── geminiProvider.ts      # Google Gemini models
│   ├── lmstudioProvider.ts    # Local LM Studio integration
│   ├── mistralProvider.ts     # Mistral AI models
│   ├── ollamaProvider.ts      # Local Ollama integration
│   ├── openaiProvider.ts      # OpenAI GPT models
│   └── openrouterProvider.ts  # OpenRouter proxy service
├── services/
│   ├── gitCommitService.ts    # Main workflow orchestration
│   ├── gitService.ts          # Git operations wrapper
│   └── secretManager.ts       # API key management
└── utils/
    ├── configurationManager.ts  # VS Code settings accessor
    ├── logger.ts                # Centralized logging utility
    └── retryHandler.ts          # Retry logic for API calls
```

## Publishing Configuration

The extension uses webpack for production bundling with automated release workflows. Key files:

- `webpack.config.js` - Bundles TypeScript to single `out/extension.js`
- `package.json` - Extension manifest with VS Code contribution points and semantic-release config
- `.vscodeignore` - Excludes source files from published extension
- `release.yml` - GitHub Actions workflow for automated publishing

### Automated Release Workflow

The project uses semantic-release for fully automated versioning and publishing:

1. **Conventional Commits** - Commit messages determine version bump type
2. **Automated Versioning** - semantic-release analyzes commits and bumps version
3. **CHANGELOG Generation** - Automated changelog based on commit history
4. **VS Code Marketplace Publishing** - Automated publishing using vsce
5. **GitHub Releases** - Automated GitHub release creation

Publishing workflow: commit → semantic-release analysis → version bump → webpack build → vsce publish → GitHub release

## Configuration System

Users configure the extension through VS Code settings UI or JSON. Core settings:

- `universal-commit-assistant.provider` - Selects which AI service to use
- `universal-commit-assistant.messageStyle` - Output format (conventional/concise/detailed/custom)
- `universal-commit-assistant.language` - Message language (8 supported languages)
- `universal-commit-assistant.includeUnstaged` - Include unstaged changes in analysis
- `universal-commit-assistant.temperature` - Controls AI creativity (0-2)
- `universal-commit-assistant.systemPrompt` - Customizes AI behavior
- `universal-commit-assistant.customPrompt` - Custom template for message generation
- `universal-commit-assistant.maxTokens` - Token limit for generated messages (100-500)
- `universal-commit-assistant.enableAnalytics` - Optional usage tracking

Provider-specific settings use nested structure:

- Cloud providers: `universal-commit-assistant.openai.model`, `universal-commit-assistant.anthropic.model`, `universal-commit-assistant.deepseek.model`
- Local providers: `universal-commit-assistant.ollama.baseUrl`, `universal-commit-assistant.lmstudio.model`

### Latest AI Model Updates (September 2025)

**OpenAI Latest Models:**

- **GPT-5 Mini** (gpt-5-mini) - Fast and cost-effective, released August 2025, 400K context window
- **GPT-5** (gpt-5) - Flagship model with state-of-the-art reasoning and coding capabilities

**Anthropic Latest Models:**

- **Claude Haiku 4.5** (claude-haiku-4-5-20251001) - Fast and cost-effective, released October 2025, 200K context window
- **Claude Sonnet 4.5** (claude-sonnet-4-5-20250929) - Enhanced reasoning and coding capabilities, released September 2025
- **Claude Opus 4.1** (claude-opus-4-1-20250805) - Most capable model with extended thinking, released August 2025

**DeepSeek Latest Models (January 2025):**

- **deepseek-chat** - DeepSeek-V3.1 Non-thinking Mode, fast general purpose model, 128K context
- **deepseek-reasoner** - DeepSeek-V3.1 Thinking Mode, advanced reasoning for complex tasks, 128K context
- **Pricing**: Competitive rates with cache hit/miss optimization
- **API**: OpenAI-compatible API at https://api.deepseek.com

**Google Gemini Latest Models:**

- **Gemini 2.5 Flash** - Most recent stable model with thinking capabilities
- **Gemini 2.5 Pro** - State-of-the-art reasoning model leading in math and science benchmarks
- **Gemini 2.5 Flash Image** - Advanced image generation and editing capabilities

## Development Best Practices

### Code Quality

- **TypeScript**: Strict typing with comprehensive interfaces
- **Error Handling**: All async operations wrapped in try-catch blocks
- **Validation**: Input validation for all user-configurable settings
- **Security**: Never log or expose API keys in any form

### Testing Strategy

- Manual testing through Extension Development Host (F5)
- Dry-run testing for release workflow (`npm run release:dry-run`)
- Provider validation through configuration validation methods

### Extension Integration

- **SCM Integration**: Button appears in VS Code source control title bar
- **Command Palette**: All commands accessible via Ctrl+Shift+P
- **Settings Integration**: Full VS Code settings UI integration with descriptions
- **Secret Storage**: Leverages VS Code's secure secret storage API

## Dependency Management

### Production Dependencies

- `axios` - HTTP client for API requests to cloud providers

### Development Dependencies

- `typescript` - TypeScript compiler
- `webpack` - Production bundling
- `@vscode/vsce` - VS Code extension packaging and publishing
- `semantic-release` - Automated versioning and publishing
- `@semantic-release/*` - Semantic release plugins for changelog, git, GitHub, and exec

### VS Code API Usage

- **Extensions API**: Git extension integration
- **Commands API**: Command registration and execution
- **Configuration API**: Settings management
- **Secrets API**: Secure API key storage
- **Window API**: User notifications and input
- **SCM API**: Source control integration
