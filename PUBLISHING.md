# Publishing Guide for Universal Commit Assistant Extension

This project uses **automated publishing** via [semantic-release](https://github.com/semantic-release/semantic-release) and GitHub Actions. Manual publishing is also supported for development and testing.

## 🚀 Automated Publishing (Recommended)

### How It Works
1. **Push commits** with [conventional commit](https://www.conventionalcommits.org/) format to `main` branch
2. **GitHub Actions** automatically triggers semantic-release
3. **Version** is bumped automatically based on commit types
4. **CHANGELOG.md** is updated automatically
5. **Extension** is built and published to VS Code Marketplace
6. **GitHub Release** is created with .vsix file

### Setup Requirements

#### 1. VS Code Marketplace Publisher Account
1. Visit: https://marketplace.visualstudio.com/manage
2. Sign in with Microsoft account
3. Create a publisher with a unique name
4. Update `"publisher"` field in `package.json`

#### 2. Personal Access Token for Marketplace
1. Visit: https://aka.ms/vsce-create-pat
2. Create token with `Marketplace (manage)` scope
3. Add as GitHub repository secret: `VSCE_PAT`

#### 3. GitHub Repository Setup
1. Make repository public on GitHub
2. Update repository URLs in `package.json`:
   ```json
   {
     "repository": {
       "type": "git",
       "url": "https://github.com/YOUR_USERNAME/universal-commit-assistant.git"
     },
     "homepage": "https://github.com/YOUR_USERNAME/universal-commit-assistant",
     "bugs": {
       "url": "https://github.com/YOUR_USERNAME/universal-commit-assistant/issues"
     }
   }
   ```

### Conventional Commit Format
```bash
# Feature (minor version bump: 1.0.0 → 1.1.0)
feat: add support for new AI provider

# Bug fix (patch version bump: 1.0.0 → 1.0.1)
fix: resolve temperature validation issue

# Breaking change (major version bump: 1.0.0 → 2.0.0)
feat!: remove deprecated ai-commit configuration
# or
feat: add new configuration system

BREAKING CHANGE: Configuration format has changed
```

### Triggering a Release
```bash
# Make your changes
git add .

# Commit with conventional format
git commit -m "feat: add support for custom system prompts"

# Push to main branch
git push origin main

# 🎉 Automatic release will be triggered!
```

### Monitoring Releases
- Check GitHub Actions tab for release progress
- View releases at: `https://github.com/YOUR_USERNAME/universal-commit-assistant/releases`
- Monitor marketplace: `https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.universal-commit-assistant`

## 🛠️ Manual Publishing (Development/Testing)

### Prerequisites
1. **Node.js and npm** installed
2. **Git repository** (public on GitHub)
3. **VS Code marketplace publisher account**
4. **Personal Access Token** with marketplace permissions

### Step-by-Step Manual Process

#### 1. Install VSCE (VS Code Extension Manager)
```bash
# Install globally
npm install -g @vscode/vsce

# Or use the local version
npx vsce --version
```

#### 2. Login to VSCE
```bash
npx vsce login YOUR_PUBLISHER_NAME
# Enter your Personal Access Token when prompted
```

#### 3. Build and Test
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Bundle for production
npm run package

# Test the extension (Press F5 in VS Code)
```

#### 4. Manual Version Management
```bash
# Update version manually
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

#### 5. Package Extension
```bash
# Create .vsix file
npx vsce package

# This creates: universal-commit-assistant-X.X.X.vsix
```

#### 6. Publish Extension
```bash
# Publish to marketplace
npx vsce publish

# Or publish specific version
npx vsce publish 1.0.0

# Or publish from .vsix file
npx vsce publish --packagePath universal-commit-assistant-1.0.0.vsix
```

## 🧪 Testing Releases

### Dry Run (Test Without Publishing)
```bash
# Test semantic-release without publishing
npm run release:dry-run

# Test manual packaging
npx vsce package --out test-extension.vsix
```

### Local Installation Testing
```bash
# Install .vsix file locally for testing
code --install-extension universal-commit-assistant-1.0.0.vsix
```

## 📊 Release Workflow Details

### Automated Workflow (GitHub Actions)
```yaml
# Triggered on push to main branch
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 22
      - Install dependencies
      - Build extension
      - Run semantic-release
      - Publish to marketplace
      - Create GitHub release
```

### What Gets Published
- **VS Code Marketplace**: Extension package (.vsix)
- **GitHub Releases**: Tagged release with .vsix attachment
- **npm Registry**: Not applicable (VS Code extension only)

## 🔍 Verification After Publishing

### 1. VS Code Marketplace
- Visit: `https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.universal-commit-assistant`
- Check version number, description, and download link

### 2. Test Installation
```bash
# Search and install in VS Code
Ctrl+Shift+X > Search "Universal Commit Assistant" > Install
```

### 3. Verify Functionality
- Test with different AI providers
- Verify settings are accessible
- Test commit message generation

## 🚨 Troubleshooting

### Common Issues

#### "Publisher not found"
- Verify publisher name in package.json matches marketplace publisher
- Ensure you're logged in: `npx vsce login YOUR_PUBLISHER_NAME`

#### "Personal Access Token invalid"
- Recreate token with correct scopes at https://aka.ms/vsce-create-pat
- Ensure token has `Marketplace (manage)` permissions
- Update GitHub secret: `VSCE_PAT`

#### "Package too large"
- Check `.vscodeignore` excludes unnecessary files
- Verify webpack bundling is working: `npm run package`
- Maximum package size: 50MB

#### Semantic-release fails
- Check conventional commit format
- Verify GITHUB_TOKEN permissions
- Ensure main branch protection allows force pushes from GitHub Actions

### Pre-publish Checklist
- [ ] Extension works in development mode (F5)
- [ ] All dependencies in package.json
- [ ] README.md is informative and up-to-date
- [ ] Version follows semantic versioning
- [ ] Publisher name is correct
- [ ] Repository is public on GitHub
- [ ] Personal Access Token is valid
- [ ] GitHub Actions have necessary permissions

## 📈 Release Strategy

### Version Bumping Strategy
- **Patch** (1.0.0 → 1.0.1): Bug fixes, documentation updates
- **Minor** (1.0.0 → 1.1.0): New features, provider additions
- **Major** (1.0.0 → 2.0.0): Breaking changes, API changes

### Release Schedule
- **Automated**: Every push to main with conventional commits
- **Manual**: As needed for hotfixes or testing
- **Regular**: Weekly releases for accumulated features

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run compile          # Compile TypeScript
npm run watch           # Watch mode
npm run package         # Production build

# Testing
npm run release:dry-run # Test semantic-release
npx vsce package        # Test packaging

# Manual Publishing
npx vsce login          # Login to marketplace
npx vsce publish        # Publish extension

# Automated (just push!)
git commit -m "feat: new feature"
git push origin main    # Triggers automated release
```