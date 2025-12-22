# Contributing to YouTube Live TTS

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Getting Started

Follow the [Quick Start](README.md#quick-start) guide to set up your development environment.

## Making Changes

### Code Style

**Backend (Python)**
- Formatted with [Ruff](https://docs.astral.sh/ruff/)
- Use type hints where possible

**Frontend (TypeScript/React)**
- Use functional components with hooks
- Follow the existing component patterns
- Use Tailwind CSS for styling
- Ensure proper TypeScript types

### Commit Messages

We follow conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
chore: maintenance tasks
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and type checks:
   ```bash
   cd frontend
   bun run lint
   bun run typecheck
   bun run build
   ```
5. Commit your changes using conventional commits
6. Push to your fork
7. Open a Pull Request

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Ensure CI checks pass

## Reporting Issues

### Bug Reports

Should include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, Node version)
- Error messages or logs

### Feature Requests

Should include:
- Clear description of the feature
- Use case and motivation
- Any implementation ideas (optional)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Questions?

Feel free to open an issue for any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.
