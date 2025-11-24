# Universal Commit Assistant

[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=gianged.universal-commit-assistant) | [Rate & Review](https://marketplace.visualstudio.com/items?itemName=gianged.universal-commit-assistant&ssr=false#review-details) | [Report Issues](https://github.com/gianged/universal-commit-assistant/issues)

**Stop writing commit messages manually.** Let AI generate perfect commit messages for you instantly, with support for 9 AI providers and 8 languages, directly in VS Code.

---

## Why Universal Commit Assistant?

- **Save Time**: Generate commit messages in seconds instead of minutes
- **Always Consistent**: Follow conventional commit standards automatically
- **Your Language**: Support for 8 languages including English, Chinese, Spanish, French, Russian, Japanese, Korean, Vietnamese
- **Privacy First**: Use local AI models (Ollama, LM Studio) or secure cloud providers

---

## Quick Start

1. **Install** - Search "Universal Commit Assistant" in VS Code Extensions
2. **Configure** - Choose your AI provider and add API key (or setup local model)
3. **Generate** - Click the sparkle button in Source Control panel

That's it! Your commit messages will be professionally written and consistent.

---

## Smart Commit Generation

- **Context-Aware**: Analyzes your actual code changes to understand what you did
- **Multiple Styles**: Choose from conventional commits, concise format, or detailed explanations
- **Deep Analysis**: Provides statistical insights (files changed, insertions, deletions, file types)
- **First Commit Detection**: Automatically generates appropriate initial commit messages
- **Smart Truncation**: Intelligently handles large diffs while preserving important context
- **Flexible Context**: Works with staged changes, unstaged changes, or both
- **Customizable**: Adjust AI creativity, message length, and add custom prompts

---

## AI Provider Options

Choose the provider that fits your needs and budget:

### Cloud Providers (API Key Required)

| Provider          | Best For              | Latest Models                                |
| ----------------- | --------------------- | -------------------------------------------- |
| **OpenAI**        | General purpose       | GPT-5.1, GPT-5.1 Codex, GPT-5                |
| **Anthropic**     | Code understanding    | Claude Haiku 4.5, Sonnet 4.5, Opus 4.1       |
| **Google Gemini** | Fast responses        | Gemini 3 Pro, Gemini 2.5 Flash               |
| **Mistral**       | European compliance   | Mistral Small, Mistral Large                 |
| **DeepSeek**      | Cost-effective        | DeepSeek-V3.1 Chat & Reasoner                |
| **Qwen**          | Alibaba Cloud         | Qwen Max, Qwen Plus, Qwen Turbo              |
| **OpenRouter**    | Access to 100+ models | Meta Llama, Claude, GPT, and more            |

### Local Providers (Privacy First)

| Provider      | Best For         | Setup                            |
| ------------- | ---------------- | -------------------------------- |
| **Ollama**    | Complete privacy | Install Ollama + download models |
| **LM Studio** | Easy local setup | Download LM Studio + any model   |

---

## Configuration

Access via `Settings` > `Extensions` > `Universal Commit Assistant`:

### Essential Settings

- **Provider**: Select your preferred AI service
- **Message Style**:
  - `conventional` - feat: add new feature
  - `concise` - add new feature
  - `detailed` - Multi-line with explanations
  - `custom` - Your own template
- **Language**: Choose from 8 supported languages
- **Include Unstaged**: Analyze uncommitted changes too

### AI Behavior

- **Temperature**: Control creativity (0 = consistent, 2 = creative)
- **Max Tokens**: Message length limit (100-500)
- **Max Diff Length**: Maximum characters of git diff to send to AI (1000-10000, default: 3000)
- **Detect First Commit**: Automatically detect and generate appropriate initial commit messages (default: enabled)
- **Custom Prompt**: Override default instructions

---

## Example Outputs

**Conventional Style:**

```
feat: add user authentication with JWT tokens

Implement secure login system with password hashing and session management
```

**Detailed Style:**

```
feat: implement user authentication system

This commit introduces a comprehensive authentication system for the application.

**Key Changes:**
- Added JWT token-based authentication
- Implemented password hashing with bcrypt
- Created user session management
- Added login/logout endpoints

**Benefits:**
- Improves application security
- Enables user-specific features
- Follows industry best practices
```

---

## Commands

Access these via Command Palette (`Ctrl+Shift+P`):

- **Generate Universal Commit Message** - Main functionality
- **Show API Key Status** - Check which providers are configured
- **Clear All API Keys** - Remove stored credentials
- **Open Settings** - Quick access to configuration

---

## Multi-Language Support

Generate commit messages in your preferred language:

- English (default)
- Chinese (Simplified)
- Spanish
- French
- Russian
- Japanese
- Korean
- Vietnamese

---

## Token Cost Analysis

Universal Commit Assistant is designed to be cost-effective while providing high-quality commit messages.

### Typical Token Usage

**Standard Analysis (current baseline):**
- ~1,000-2,300 tokens per commit
- Includes: file list, basic diff (2000 chars), prompts

**Enhanced Analysis (with deep features):**
- ~1,800-3,200 tokens per commit
- Includes: file list, statistics, enhanced diff (3000 chars), file categorization

### Cost per Commit by Provider

Based on enhanced analysis (~2,500 input tokens + 150 output tokens average):

| Provider             | Model              | Cost per Commit | Cost per 100 Commits |
| -------------------- | ------------------ | --------------- | -------------------- |
| **OpenAI**           | GPT-5.1            | ~$0.0008        | ~$0.08               |
| **OpenAI**           | GPT-5.1 Codex      | ~$0.005         | ~$0.50               |
| **Anthropic**        | Claude Haiku 4.5   | ~$0.003         | ~$0.30               |
| **Anthropic**        | Claude Sonnet 4.5  | ~$0.010         | ~$1.00               |
| **DeepSeek**         | deepseek-chat      | ~$0.0009        | ~$0.09               |
| **Gemini**           | Gemini 3 Pro       | ~$0.0003        | ~$0.03               |
| **Qwen**             | Qwen Plus          | ~$0.0006        | ~$0.06               |
| **Ollama/LM Studio** | Local Models       | **FREE**        | **FREE**             |

### Cost Optimization Tips

1. **Use Cost-Effective Providers**: Gemini 3 Pro, DeepSeek, Qwen, and GPT-5.1 offer excellent quality at low cost
2. **Adjust Max Diff Length**: Reduce `maxDiffLength` to 2000 for simpler commits
3. **Local Models**: Use Ollama or LM Studio for completely free operation
4. **Smart Defaults**: The extension uses intelligent truncation to minimize tokens while preserving context

**Bottom Line**: Even with premium models, most users spend less than $1/month on commit message generation.

---

## Requirements

- **VS Code**: Version 1.95.0 or higher
- **Git Repository**: With changes to commit
- **AI Provider**: API key (cloud) or running server (local)

---

## Privacy & Security

- **Secure Storage**: API keys stored in VS Code's encrypted secret storage
- **No Data Retention**: Your code never leaves your machine with local providers
- **Optional Analytics**: Usage tracking can be disabled (no sensitive data collected)
- **Open Source**: Full transparency with MIT license

---

## Need Help?

- **Documentation**: See configuration examples above
- **Issues**: [Report bugs on GitHub](https://github.com/gianged/universal-commit-assistant/issues)
- **Feature Requests**: [Suggest improvements](https://github.com/gianged/universal-commit-assistant/issues)
- **Rate & Review**: Help others discover this extension

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made for developers who value their time**

_Save hours every week on commit messages. Install now and never write another commit message manually._
