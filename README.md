# YouTube Live TTS

Let your chat speak for itself. Real-time text-to-speech for YouTube live streams, powered by ElevenLabs.

<p align="center">
  <a href="https://docs.python.org/3.12/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Python-3.12.svg?variant=secondary&amp;logo=python&amp;mode=dark" /><img alt="Python 3.12" src="https://shieldcn.dev/badge/Python-3.12.svg?variant=secondary&amp;logo=python&amp;mode=light" /></picture></a>
  <a href="https://bun.sh/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/runtime-Bun.svg?variant=secondary&amp;logo=bun&amp;mode=dark" /><img alt="Bun runtime" src="https://shieldcn.dev/badge/runtime-Bun.svg?variant=secondary&amp;logo=bun&amp;mode=light" /></picture></a>
  <a href="https://elevenlabs.io/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/voices-ElevenLabs.svg?variant=secondary&amp;logo=elevenlabs&amp;mode=dark" /><img alt="ElevenLabs voices" src="https://shieldcn.dev/badge/voices-ElevenLabs.svg?variant=secondary&amp;logo=elevenlabs&amp;mode=light" /></picture></a>
  <a href="./LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/license-Apache%202.0.svg?variant=secondary&amp;mode=dark" /><img alt="Apache License 2.0" src="https://shieldcn.dev/badge/license-Apache%202.0.svg?variant=secondary&amp;mode=light" /></picture></a>
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="frontend/public/cover-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="frontend/public/cover-light.png">
  <img alt="YouTube Live TTS" src="frontend/public/cover-light.png">
</picture>

## Features

- **Real-time chat monitoring:**  Watch messages flow in as they happen
- **AI-powered voices:** High-quality TTS with ElevenLabs API
- **Modern web dashboard:** Configure and monitor from your browser
- **Customizable templates:** Set your own "{author} says: {message}" format
- **Smart message queue:** Prevents audio overlap
- **Anti-spam protection:** Per-user cooldowns and message length limits
- **Dark/Light theme:** System preference detection
- **i18n support:** English and Spanish
- **Cross-platform:** Windows, macOS and Linux

## Quick Start

### 1. Prerequisites

<details>
<summary><b>macOS</b></summary>

```bash
# Python
brew install python@3.12

# Bun
brew install oven-sh/bun/bun
```

</details>

<details>
<summary><b>Linux</b></summary>

```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip libportaudio2 libsndfile1
curl -fsSL https://bun.com/install | bash

# Fedora
sudo dnf install python3 python3-pip portaudio libsndfile
curl -fsSL https://bun.com/install | bash
```

</details>

<details>
<summary><b>Windows</b></summary>

```powershell
# Python (via winget)
winget install Python.Python.3.12

# Bun
powershell -c "irm bun.sh/install.ps1 | iex"
```

</details>

### 2. Install

```bash
git clone https://github.com/emiliioaguirre/youtube-live-tts.git
cd youtube-live-tts

python3.12 -m pip install -r backend/requirements.txt
cd frontend && bun install && cd ..
```

### 3. Run

```bash
bun dev
```

The backend includes versioned defaults, so a fresh clone does not need a private
`backend/config.py`. Existing local configuration files remain supported as
overrides. Without a local override, CORS allows `http://localhost:3000`; set the
`CORS_ORIGINS` environment variable to a comma-separated list to change it.
The backend does not automatically load `.env` files.

For development checks, regression tests, and dependency audits, see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Built With

- [pytchat](https://github.com/taizan-hokuto/pytchat) - Open-source python tchat for basic text communications
- [ElevenLabs](https://elevenlabs.io) - AI Text-to-Speech
- [FastAPI](https://fastapi.tiangolo.com) - Python backend
- [Next.js](https://nextjs.org) - React framework
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Zustand](https://zustand-demo.pmnd.rs) - State management
- [Tailwind CSS](https://tailwindcss.com) - Styling

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Apache License 2.0
