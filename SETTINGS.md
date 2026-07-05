# Universal Commit Assistant Settings Guide

Complete configuration guide for customizing Universal Commit Assistant to your workflow.

## 🚀 Quick Access

**Settings UI**: `File > Preferences > Settings` → Search "Universal Commit Assistant"
**Command Palette**: `Ctrl+Shift+P` → "Universal Commit Assistant: Open Settings"
**Direct JSON**: Add settings to your `settings.json` file

## ⚙️ Core Settings

### AI Provider Selection
```json
"universal-commit-assistant.provider": "openai"
```
**Options**: `openai`, `anthropic`, `gemini`, `mistral`, `deepseek`, `openrouter`, `ollama`, `lmstudio`
**Default**: `openai`
**Description**: Choose which AI service generates your commit messages

### Change Analysis Context
```json
"universal-commit-assistant.includeUnstaged": true
```
**Type**: Boolean
**Default**: `true`
**Description**: Include unstaged changes in the analysis for more comprehensive commit messages

### Message Style
```json
"universal-commit-assistant.messageStyle": "conventional"
```
**Options**:
- `conventional`: Conventional Commits format (e.g., "feat: add user authentication")
- `concise`: Short and direct (max 50 characters)
- `detailed`: Comprehensive with context and reasoning
- `custom`: Use your own prompt template

**Default**: `conventional`

### Language Selection
```json
"universal-commit-assistant.language": "english"
```
**Options**: `english`, `chinese`, `spanish`, `french`, `russian`, `japanese`, `korean`, `vietnamese`
**Default**: `english`
**Description**: Language for generated commit messages

## 🎛️ Advanced Settings

### Temperature Control
```json
"universal-commit-assistant.temperature": 0.3
```
**Range**: 0-2
**Default**: `0.3`
**Description**: Controls AI creativity/randomness
- `0.0`: Deterministic, same input = same output
- `0.3`: Slightly creative (recommended)
- `0.7`: Balanced creativity
- `1.5`: Very creative, more varied outputs

### System Prompt Customization
```json
"universal-commit-assistant.systemPrompt": "You are a helpful assistant that generates git commit messages. Generate clear, concise commit messages that follow best practices."
```
**Type**: String
**Default**: Standard helpful assistant prompt
**Description**: Customize AI behavior and response style

**Example Customizations**:
```json
// Angular Convention Style
"universal-commit-assistant.systemPrompt": "You are a senior developer who writes commit messages following Angular convention. Always use lowercase and be specific about changes."

// Detailed Analysis Style
"universal-commit-assistant.systemPrompt": "Analyze code changes thoroughly and provide detailed commit messages that explain both what changed and why it was necessary."

// Concise Style
"universal-commit-assistant.systemPrompt": "Generate extremely concise commit messages under 40 characters. Use present tense and imperative mood."
```

### Token Limits
```json
"universal-commit-assistant.maxTokens": 100
```
**Range**: 50-500
**Default**: `100`
**Description**: Maximum length of generated commit messages

### Custom Prompt Template
```json
"universal-commit-assistant.customPrompt": "Based on these changes: {changes}\n\nGenerate a commit message that explains what changed and why it was necessary."
```
**Type**: String
**Default**: Empty
**Used when**: `messageStyle` is set to `"custom"`
**Placeholder**: Use `{changes}` for git diff content

### Analytics
```json
"universal-commit-assistant.enableAnalytics": false
```
**Type**: Boolean
**Default**: `false`
**Description**: Enable usage analytics (no sensitive data collected)

## 🤖 Provider-Specific Settings

### OpenAI
```json
"universal-commit-assistant.openai.model": "gpt-5.4-mini"
```
**Available Models**:
- `gpt-5.4-mini`: Fast and cost-effective (recommended)
- `gpt-5.4-nano`: Cheapest and fastest
- `gpt-5.4`: Strong general purpose model
- `gpt-5.5`: Latest flagship model
- `gpt-5.3-codex`: Optimized for coding tasks

### Anthropic
```json
"universal-commit-assistant.anthropic.model": "claude-haiku-4-5"
```
**Popular Models**:
- `claude-haiku-4-5`: Fast and cost-effective (recommended)
- `claude-sonnet-5`: Near-Opus coding quality at mid-tier price
- `claude-sonnet-4-6`: Previous Sonnet generation
- `claude-opus-4-8`: Most capable model

### Google Gemini
```json
"universal-commit-assistant.gemini.model": "gemini-3.1-flash-lite"
```
**Popular Models**:
- `gemini-3.1-flash-lite`: Cheap and fast, free tier available (recommended)
- `gemini-3.5-flash`: Fast with strong coding and reasoning
- `gemini-3.1-pro-preview`: Reasoning-first model with 1M context (no free tier)
- `gemini-2.5-flash`: Previous generation, fast and cost-effective

### Mistral AI
```json
"universal-commit-assistant.mistral.model": "mistral-small-latest"
```
**Popular Models**:
- `mistral-small-latest`: Balanced performance and cost, 256k context (recommended)
- `ministral-8b-latest`: Cheapest and fastest
- `mistral-medium-latest`: Frontier-class model
- `mistral-large-latest`: Most capable
- `codestral-latest`: Optimized for coding tasks

### DeepSeek
```json
"universal-commit-assistant.deepseek.model": "deepseek-v4-flash"
```
**Available Models**:
- `deepseek-v4-flash`: Fast and cost-effective, 1M context (recommended)
- `deepseek-v4-pro`: Most capable model

### Ollama (Local)
```json
"universal-commit-assistant.ollama.model": "qwen3.5:4b",
"universal-commit-assistant.ollama.baseUrl": "http://localhost:11434"
```
**Popular Models**:
- `qwen3.5:4b`: Newest generation, light enough for consumer hardware (recommended)
- `qwen3.5:9b`: Larger Qwen for better quality
- `gemma4:12b`: Strong general model
- `llama3.2`: Small and widely supported

**Setup Requirements**:
1. Install Ollama: https://ollama.ai
2. Pull model: `ollama pull qwen3.5:4b`
3. Verify server: `curl http://localhost:11434/api/version`

### LM Studio (Local)
```json
"universal-commit-assistant.lmstudio.model": "qwen/qwen3.5-9b",
"universal-commit-assistant.lmstudio.baseUrl": "http://localhost:1234"
```
**Setup Requirements**:
1. Download LM Studio: https://lmstudio.ai
2. Load any compatible model
3. Start local server
4. Configure base URL if different from default

The model setting must match a model loaded in LM Studio (check `GET http://localhost:1234/v1/models`).

### OpenRouter
```json
"universal-commit-assistant.openrouter.model": "google/gemini-3.1-flash-lite"
```
**Popular Models**:
- `google/gemini-3.1-flash-lite`: Cheap and fast (recommended)
- `anthropic/claude-haiku-4.5`: Anthropic via OpenRouter
- `deepseek/deepseek-v4-flash`: Cost-effective with 1M context
- `openrouter/auto`: Automatic model routing

## 🔐 Secret Management

### API Key Commands
Access via Command Palette (`Ctrl+Shift+P`):

- **"Universal Commit Assistant: Show API Key Status"** - View which providers have stored keys
- **"Universal Commit Assistant: Clear All API Keys"** - Remove all stored API keys (requires confirmation)

### Security Features
- ✅ API keys stored securely using VS Code's SecretStorage
- ✅ Keys encrypted and tied to your VS Code installation
- ✅ Keys never logged or transmitted except to respective AI providers
- ✅ No sensitive data collected in analytics
- ✅ Local providers (Ollama/LM Studio) require no API keys

## 📋 Configuration Examples

### Conventional Commits with Claude
```json
{
  "universal-commit-assistant.provider": "anthropic",
  "universal-commit-assistant.messageStyle": "conventional",
  "universal-commit-assistant.temperature": 0.2,
  "universal-commit-assistant.language": "english",
  "universal-commit-assistant.systemPrompt": "Generate conventional commit messages. Use types: feat, fix, docs, style, refactor, test, chore. Keep descriptions under 50 characters.",
  "universal-commit-assistant.anthropic.model": "claude-haiku-4-5"
}
```

### Detailed Commits with GPT-5.4
```json
{
  "universal-commit-assistant.provider": "openai",
  "universal-commit-assistant.messageStyle": "detailed",
  "universal-commit-assistant.temperature": 0.4,
  "universal-commit-assistant.maxTokens": 200,
  "universal-commit-assistant.language": "english",
  "universal-commit-assistant.openai.model": "gpt-5.4"
}
```

### Privacy-Focused with Ollama
```json
{
  "universal-commit-assistant.provider": "ollama",
  "universal-commit-assistant.messageStyle": "concise",
  "universal-commit-assistant.temperature": 0.1,
  "universal-commit-assistant.ollama.model": "qwen2.5-coder",
  "universal-commit-assistant.ollama.baseUrl": "http://localhost:11434"
}
```

### Multi-language with Gemini
```json
{
  "universal-commit-assistant.provider": "gemini",
  "universal-commit-assistant.messageStyle": "conventional",
  "universal-commit-assistant.language": "chinese",
  "universal-commit-assistant.temperature": 0.3,
  "universal-commit-assistant.gemini.model": "gemini-3.1-flash-lite"
}
```

### Custom Template for Team Standards
```json
{
  "universal-commit-assistant.messageStyle": "custom",
  "universal-commit-assistant.customPrompt": "Changes:\n{changes}\n\nGenerate a commit message following our team format:\n[JIRA-ID] [TYPE] Brief description\n\nDetailed explanation of what changed and why.\n\nTypes: FEATURE, BUGFIX, HOTFIX, REFACTOR, DOCS, TEST",
  "universal-commit-assistant.temperature": 0.2
}
```

## 🚨 Troubleshooting

### Common Issues

#### "Provider configuration invalid"
- **Check**: API key is set correctly
- **Action**: Use Command Palette → "Universal Commit Assistant: Show API Key Status"
- **Fix**: Re-enter API key or verify provider settings

#### "No response from AI"
- **Check**: Model name is correct for your provider
- **Check**: Internet connection (cloud providers)
- **Check**: Local server is running (Ollama/LM Studio)
- **Action**: Try `curl http://localhost:11434/api/version` for Ollama

#### "Generated messages are too generic"
- **Increase**: Temperature to 0.5-0.8
- **Customize**: System prompt with more specific instructions
- **Switch**: To detailed message style
- **Add**: Custom prompt template

#### "Messages are inconsistent"
- **Decrease**: Temperature to 0.1-0.3
- **Use**: More specific system prompt
- **Switch**: To conventional style
- **Enable**: includeUnstaged for more context

#### "Extension not working"
- **Check**: VS Code version (minimum 1.74.0)
- **Check**: Git repository is initialized
- **Check**: Changes exist to analyze
- **Restart**: VS Code or reload window

### Performance Optimization

#### Faster Responses
- Use local providers (Ollama/LM Studio)
- Choose faster models (gpt-5.4-mini, claude-haiku-4-5, gemini-3.1-flash-lite)
- Reduce maxTokens for shorter messages
- Set lower temperature for more deterministic output

#### Better Quality
- Use premium models (gpt-5.5, claude-sonnet-5, claude-opus-4-8)
- Include unstaged changes for more context
- Customize system prompt for your coding style
- Use detailed message style for complex changes

### Reset to Defaults

#### Via Settings UI
1. Open VS Code settings (`Ctrl+,`)
2. Search "Universal Commit Assistant"
3. Click gear icon next to each setting → "Reset Setting"

#### Via settings.json
```json
{
  // Remove all "universal-commit-assistant.*" entries
  // Extension will use built-in defaults
}
```

#### Clear All API Keys
Command Palette → "Universal Commit Assistant: Clear All API Keys"

## 🔗 Related Documentation

- [README.md](README.md) - Overview and installation
- [PUBLISHING.md](PUBLISHING.md) - Publishing and release process
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message standard