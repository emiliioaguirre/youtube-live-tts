<p align="center">
  <img alt="YouTube Live TTS logo" src="frontend/public/logo.svg" width="96" height="96" />
</p>

<h1 align="center">YouTube Live TTS</h1>

<p align="center">
  Let your chat speak for itself. Real-time text-to-speech for YouTube live streams, powered by ElevenLabs.
</p>

<p align="center">
  <a href="https://docs.python.org/3.12/"><img alt="Python 3.12" src="https://shieldcn.dev/badge/Python%203.12.svg?variant=branded&amp;brand=python" /></a>
  <a href="https://bun.sh/"><img alt="Bun" src=".github/assets/bun-badge.svg" /></a>
  <a href="https://elevenlabs.io/"><img alt="ElevenLabs" src="https://shieldcn.dev/badge/ElevenLabs.svg?variant=branded&amp;brand=elevenlabs&amp;logo=elevenlabs" /></a>
  <a href="https://www.youtube.com/"><img alt="YouTube" src="https://shieldcn.dev/badge/YouTube.svg?variant=branded&amp;brand=youtube" /></a>
</p>

<p align="center">
  <a href="https://github.com/emiliioaguirre/youtube-live-tts"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/group/github/stars/emiliioaguirre/youtube-live-tts+github/ci/emiliioaguirre/youtube-live-tts+github/license/emiliioaguirre/youtube-live-tts.svg?variant=secondary&amp;workflow=ci.yml&amp;branch=main&amp;mode=dark" /><img alt="GitHub stars, CI status and license" src="https://shieldcn.dev/group/github/stars/emiliioaguirre/youtube-live-tts+github/ci/emiliioaguirre/youtube-live-tts+github/license/emiliioaguirre/youtube-live-tts.svg?variant=secondary&amp;workflow=ci.yml&amp;branch=main&amp;mode=light" /></picture></a>
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="frontend/public/cover-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="frontend/public/cover-light.png">
  <img alt="YouTube Live TTS" src="frontend/public/cover-light.png">
</picture>

## Features

- **Real-time chat monitoring:** Watch messages flow in as they happen
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

### 4. Use

1. Open [http://localhost:3000](http://localhost:3000).
2. Paste your [ElevenLabs API key](https://elevenlabs.io/app/settings/api-keys).
3. Paste the URL of a YouTube live stream.
4. Press **Start**. Chat messages are read aloud through your default audio device.

> [!NOTE]
> The stream must be public and live right now. Ended streams can't be read.

## Built With

- [pytchat](https://github.com/taizan-hokuto/pytchat) - YouTube live chat reader
- [ElevenLabs](https://elevenlabs.io) - AI Text-to-Speech
- [FastAPI](https://fastapi.tiangolo.com) - Python backend
- [Next.js](https://nextjs.org) - React framework
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Zustand](https://zustand-demo.pmnd.rs) - State management
- [Tailwind CSS](https://tailwindcss.com) - Styling

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[Apache License 2.0](LICENSE)
