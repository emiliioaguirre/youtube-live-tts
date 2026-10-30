# Contributing to YouTube Live TTS

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Getting Started

Follow the [Quick Start](README.md#quick-start) guide to set up your development environment.

## Making Changes

### Code Style

**Backend (Python)**
- Formatted with [Ruff](https://docs.astral.sh/ruff/)
- Install development tools with `python3.12 -m pip install -r backend/requirements-dev.txt` to use the same Ruff version as CI. The lint baseline is declared in `ruff.toml`.
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
2. Start from the latest `development` and create a feature branch:
   ```bash
   git fetch origin
   git switch development
   git pull --ff-only origin development
   git switch -c feat/amazing-feature
   ```
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
7. Open a Pull Request targeting `development`

### Branches and Maintenance

- `main` contains changes that have been reviewed and promoted from `development`.
- `development` is the integration branch for features, fixes, and dependency updates. Keep it after release PRs are merged.
- CI runs on pushes and pull requests targeting either branch. Before merging, frontend lint, type checks, build, and backend lint/format checks must pass, and at least one review approval is required.
- Promote reviewed changes with a pull request from `development` to `main`. Use a merge commit for release PRs so both long-lived branches retain shared history; squash merges are suitable for feature PRs into `development`. Sync `development` with `main` after releases or urgent fixes.
- Dependabot is configured to check Bun dependencies in `/frontend`, pip requirements in `/backend`, and GitHub Actions every Monday at 09:00 in `America/Mexico_City`. Version-update PRs target `development`; minor and patch updates are grouped per ecosystem, while major updates remain separate for review.
- The Dependabot configuration must exist on the default branch (`main`) before scheduled version updates can start. This schedule creates proposals; dependency changes still need review and merging.
- Dependabot security updates, when enabled in repository settings, target the default branch. Bring those fixes back into `development` as well.

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
