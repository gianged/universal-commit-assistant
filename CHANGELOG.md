# [1.2.0](https://github.com/gianged/universal-commit-assistant/compare/v1.1.4...v1.2.0) (2025-09-20)


### Features

* **universal-commit-assistant:** add initial project files and configuration ([cb789a0](https://github.com/gianged/universal-commit-assistant/commit/cb789a09337caa1a346678e8e49ad36a8c740ff7))

## [1.1.4](https://github.com/gianged/universal-commit-assistant/compare/v1.1.3...v1.1.4) (2025-09-15)


### Bug Fixes

* use vsce package to create VSIX file for marketplace publishing ([df66650](https://github.com/gianged/universal-commit-assistant/commit/df6665052914825cb4dcb355e9b258c425f204f6))

## [1.1.3](https://github.com/gianged/universal-commit-assistant/compare/v1.1.2...v1.1.3) (2025-09-15)


### Bug Fixes

* update CHANGELOG.md with new release notes and test automate bot ([b6ce960](https://github.com/gianged/universal-commit-assistant/commit/b6ce960d8811695f02fad21020d3d6ea83e92805))

## [1.1.2](https://github.com/gianged/universal-commit-assistant/compare/v1.1.1...v1.1.2) (2025-09-15)


### Bug Fixes

* add semantic-release npm plugin to update package.json version ([0750c51](https://github.com/gianged/universal-commit-assistant/commit/0750c51d9e99c57e6d3a8f78e65be957f3e0a34c))
* disable npm publishing for VS Code extension ([5c28bd6](https://github.com/gianged/universal-commit-assistant/commit/5c28bd6192e415738475cffa97e6098706eec809))

## [1.1.1](https://github.com/gianged/universal-commit-assistant/compare/v1.1.0...v1.1.1) (2025-09-15)


### Bug Fixes

* update.vscodeignore and README.md, and test release bot ([0ca150f](https://github.com/gianged/universal-commit-assistant/commit/0ca150f50224885326307b9628d831ce79411157))

# [1.1.0](https://github.com/gianged/universal-commit-assistant/compare/v1.0.0...v1.1.0) (2025-09-15)


### Features

* enable automated semantic releases ([c39e0e8](https://github.com/gianged/universal-commit-assistant/commit/c39e0e8d3168f61213c044f2763ea0d8fff8c3b7))

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
