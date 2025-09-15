# [1.1.0](https://github.com/gianged/universal-commit-assistant/compare/v1.0.0...v1.1.0) (2025-09-15)


### Features

* enable automated semantic releases ([c39e0e8](https://github.com/gianged/universal-commit-assistant/commit/c39e0e8d3168f61213c044f2763ea0d8fff8c3b7))

# 1.0.0 (2025-09-15)


### Bug Fixes

* update dependencies to latest versions, and test automated release ([33873fe](https://github.com/gianged/universal-commit-assistant/commit/33873fe7d6b80e8f616fc6b1251ac1c32f2bfcbe))

# Changelog

All notable changes to the Universal Commit Assistant extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2025-09-14

### Fixed
- Improved prompt styles and formatting across all AI providers
- Enhanced provider configuration handling
- Updated documentation with better setup instructions

### Changed
- Refined base provider architecture for better consistency
- Improved OpenRouter provider with better error handling
- Updated package metadata and keywords for better discoverability

## [1.0.1] - 2025-09-13

### Fixed
- Package version number correction
- Updated extension categories and tags for VS Code marketplace

## [1.0.0] - 2025-09-13

### Added
- Initial release of Universal Commit Assistant extension
- Support for multiple AI providers:
  - OpenAI (GPT-4o-mini, GPT-4o, GPT-3.5-turbo)
  - Anthropic (Claude 3.5 Haiku, Claude 3.5 Sonnet)
  - Google Gemini (Gemini 1.5 Flash, Gemini 2.5 Pro)
  - Mistral AI (Mistral Small Latest, Mistral Large)
  - Ollama (local models - Llama 3.2, CodeLlama, etc.)
  - LM Studio (local models via server)
  - OpenRouter (proxy to various models)
- Multi-language support for commit messages:
  - English, Chinese, Spanish, French, Russian, Japanese, Korean, Vietnamese
- Source control integration with sparkle button in VS Code SCM panel
- Multiple commit message styles:
  - Conventional Commits format
  - Concise messages
  - Detailed messages with context
  - Custom prompt templates
- Secure API key storage using VS Code SecretStorage
- Support for analyzing both staged and unstaged changes
- Configurable temperature control for AI creativity
- Custom system prompts for AI behavior customization
- Token limit configuration for message length control
- Comprehensive error handling and validation
- Settings management through VS Code settings UI
- Command palette integration for all features

### Features
- **Smart Change Analysis**: Analyzes git diffs to understand code changes
- **Provider Auto-Switching**: Seamlessly switch between different AI providers
- **Offline Capability**: Works with local models (Ollama, LM Studio)
- **Privacy-Focused**: API keys stored securely, no data logging
- **Extensible Architecture**: Plugin-based provider system for easy expansion

---

*Note: This changelog is automatically maintained by [semantic-release](https://github.com/semantic-release/semantic-release).
Future releases will be automatically documented based on conventional commit messages.*
