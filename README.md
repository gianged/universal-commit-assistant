# Universal Commit Assistant

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/gianged.universal-commit-assistant?style=flat-square&label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=gianged.universal-commit-assistant)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/gianged.universal-commit-assistant?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=gianged.universal-commit-assistant)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/gianged.universal-commit-assistant?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=gianged.universal-commit-assistant)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

Universal AI-powered commit message generator supporting multiple providers and languages directly in VS Code.

## ✨ Features

- **🤖 Multiple AI Providers**: Support for OpenAI, Anthropic, Gemini, Mistral, Ollama, LM Studio, and OpenRouter
- **🌍 Multi-Language Support**: Generate commit messages in 8 languages (English, Chinese, Spanish, French, Russian, Japanese, Korean, Vietnamese)
- **⚡ Source Control Integration**: One-click button directly in VS Code's source control panel
- **🎯 Flexible Context**: Choose to include staged changes only or both staged and unstaged changes
- **📝 Multiple Message Styles**: Conventional commits, concise, detailed, or custom prompts
- **🔒 Secure API Key Storage**: API keys are stored securely using VS Code's secret storage
- **🏠 Offline Support**: Works with local models (Ollama, LM Studio) for privacy-conscious users
- **⚙️ Highly Configurable**: Customize temperature, system prompts, token limits, and more

## 🤖 Supported Providers

| Provider | Models | Type | Notes |
|----------|--------|------|-------|
| **OpenAI** | GPT-4o-mini, GPT-4o, GPT-3.5-turbo | Cloud | Most popular, reliable |
| **Anthropic** | Claude 3.5 Haiku, Claude 3.5 Sonnet | Cloud | Great for detailed analysis |
| **Google Gemini** | Gemini 1.5 Flash, Gemini 2.5 Pro | Cloud | Fast and efficient |
| **Mistral** | Mistral Small Latest, Mistral Large | Cloud | European AI provider |
| **Ollama** | Llama 3.2, CodeLlama, Qwen, etc. | Local | Privacy-focused, offline |
| **LM Studio** | Any compatible model | Local | User-managed local server |
| **OpenRouter** | 100+ models | Proxy | Access to multiple providers |

## 🚀 Installation

1. **Install from VS Code Marketplace**:
   - Open VS Code
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for "Universal Commit Assistant"
   - Click Install

2. **Configure your AI provider**:
   - Open Settings (`Ctrl+,`)
   - Search for "Universal Commit Assistant"
   - Select your preferred provider
   - Add API key when prompted (for cloud providers)

3. **Start using**:
   - Make changes to your code
   - Click the ✨ button in the Source Control panel
   - Let AI generate your commit message!

## 📖 Usage

### Basic Usage
1. Make changes to your code
2. Stage your changes (optional - extension works with unstaged changes too)
3. Click the **"Generate Universal Commit Message"** button (✨) in the source control panel
4. Review and edit the generated message if needed
5. Commit your changes

### Advanced Usage
- **Custom Prompts**: Define your own prompt templates for specific project needs
- **Multi-language**: Generate commit messages in your preferred language
- **Message Styles**: Choose from conventional (with type prefix), concise (short, no prefix), detailed (multi-line), or custom formats
- **Temperature Control**: Adjust AI creativity from deterministic (0) to very creative (2)
- **Provider Switching**: Easily switch between different AI providers based on your needs

### Detailed Message Style

When using the **"detailed"** message style, the extension generates comprehensive multi-line commit messages with:

- **Structured format** with title, description, and bullet points
- **Detailed explanations** of what was changed and why
- **Bold formatting** for section headers and key points
- **Bullet point summaries** of specific improvements

**Example output:**
```
fix: Handle date parsing and display in Excel export

This commit addresses issues with date handling in the Excel export functionality.

- **Improved Date Parsing:** Introduced a TryParseDate helper method to robustly parse various date string formats
- **Correct Excel Date Formatting:** Modified export logic to explicitly handle DateTime values with "yyyy-mm-dd" format
- **Updated Data Model:** Changed date-related properties from string to DateTime? for better type accuracy

These changes improve the reliability and accuracy of date representation in exported reports.
```

**To enable:** Go to Settings → Extensions → Universal Commit Assistant → Set "Message Style" to "detailed"

## ⚙️ Configuration

Access settings via `File > Preferences > Settings`, then search for "Universal Commit Assistant":

### Core Settings
- **Provider**: Choose your AI provider (`openai`, `anthropic`, `gemini`, `mistral`, `ollama`, `lmstudio`, `openrouter`)
- **Include Unstaged**: Whether to include unstaged changes in analysis
- **Message Style**: `conventional` (with type prefix: feat:, fix:), `concise` (short, no prefix), `detailed` (multi-line with explanations), or `custom`
- **Language**: Select from 8 supported languages
- **Temperature**: Control AI creativity (0-2, default: 0.3)
- **Max Tokens**: Maximum length for generated messages (100-500, default: 200)

### Provider-Specific Settings
Each provider has its own configuration options for models and endpoints. See the [Settings Guide](SETTINGS.md) for detailed configuration instructions.

## 🔧 Requirements

- **VS Code**: 1.104.0 or higher
- **Git**: Repository with changes to commit
- **API Key**: Required for cloud providers (OpenAI, Anthropic, Gemini, Mistral, OpenRouter)
- **Local Server**: Required for local providers (Ollama, LM Studio)

## 🛠️ Development

### Setup
```bash
# Clone the repository
git clone https://github.com/gianged/universal-commit-assistant.git
cd universal-commit-assistant

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Launch Extension Development Host
# Press F5 in VS Code
```

### Available Scripts
```bash
npm run compile          # Compile TypeScript
npm run watch            # Watch mode for development
npm run package          # Build production bundle
npm run semantic-release # Automated release (CI/CD)
npm run release:dry-run  # Test release process
```

### Project Structure
```
src/
├── extension.ts              # Entry point
├── types/index.ts           # TypeScript interfaces
├── providers/               # AI provider implementations
│   ├── baseProvider.ts      # Abstract base class
│   ├── aiProviderFactory.ts # Factory pattern
│   └── *Provider.ts         # Individual providers
├── services/                # Business logic
│   ├── gitCommitService.ts  # Main workflow
│   ├── gitService.ts        # Git operations
│   └── secretManager.ts     # API key management
└── utils/
    └── configurationManager.ts # Settings management
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Commit Convention
This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation:

```bash
feat: add support for new AI provider
fix: resolve temperature validation issue
docs: update installation instructions
```

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes following the commit convention
4. Push to your branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all AI providers for their excellent APIs
- VS Code team for the robust extension platform
- Contributors and users who make this project better

## 📊 Release Process

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and publishing:

- **Commits** trigger automated analysis
- **Versions** are bumped automatically based on commit types
- **Changelog** is generated automatically
- **Publishing** to VS Code Marketplace is automated
- **GitHub Releases** are created automatically

---

**Made with ❤️ for the developer community**