# Contributing to CanvasMapper

Thank you for your interest in contributing to CanvasMapper! 🎉

## Project Status

This project is in **alpha** stage. The API is not stable and may change without notice.

## 📋 How to Contribute

### 🐛 Reporting Bugs

1. Check [existing issues](https://github.com/akak1y/canvasmapper/issues) first
2. Create a new issue including:
    - A clear description of the problem
    - Steps to reproduce
    - Expected vs actual behavior
    - Environment (browser, OS, library version)

### 💡 Suggesting Features

1. Open an issue with the label `enhancement`
2. Describe the use case
3. Propose an API design if possible

### 🔧 Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Write tests for new functionality
4. Follow the code style (ESLint + Prettier)
5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
6. Push and open a Pull Request

## 💻 Development Setup

```bash
# Clone your fork
git clone https://github.com/akak1y/canvasmapper.git
cd canvasmapper

# Install dependencies
npm install

# Run the dev server with examples
npm run dev

# Run tests
npm run test

# Build the library
npm run build
```

## 📝 Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

### Types

- `feat` — a new feature
- `fix` — a bug fix
- `docs` — documentation only
- `style` — code style (formatting, no logic change)
- `refactor` — code refactoring
- `perf` — performance improvement
- `test` — adding or updating tests
- `chore` — maintenance tasks

### Examples

```
feat(camera): add smooth zoom animation
fix(tiles): correct tile coordinate calculation
docs: update README with usage examples
perf(markers): optimize viewport culling
```

## 🧪 Testing

- Write unit tests for new features
- Run `npm run test` before committing
- Make sure `npm run lint` passes

## 🤝 Code of Conduct

Be respectful and constructive in all interactions.

Thank you for contributing! ❤️
