export const translations = {
  en: {
    // Dashboard
    dashboard: "Dashboard",

    // Stats
    messagesRead: "Messages Read",
    inQueue: "In Queue",
    botStatus: "Bot Status",
    youtubeChat: "YouTube Chat",
    running: "Running",
    stopped: "Stopped",
    connected: "Connected",
    disconnected: "Disconnected",

    // Stats tooltips
    messagesTooltip: "Total messages read aloud by TTS",
    queueTooltip: "Messages waiting to be read",
    botTooltip: "Current bot running status",
    youtubeTooltip: "Connection status to YouTube live chat",

    // Configuration
    configuration: "Configuration",
    save: "Save",
    elevenLabsApiKey: "ElevenLabs API Key",
    getApiKey: "Get your API key",
    youtubeVideoId: "YouTube URL",
    voiceId: "Voice ID",
    ttsPrefix: "TTS Prefix (empty = all messages)",
    ttsTemplate: "Message Format",
    ttsTemplatePlaceholder: "{author} says: {message}",
    ttsTemplateHint: "Use {author} and {message} as placeholders",
    volume: "Volume",
    speed: "Speed",
    cooldown: "Cooldown",

    // Live Chat
    liveChat: "Live Chat",
    noMessages: "No messages yet",
    messagesWillAppear: "Messages will appear here when the bot is running",
    loadingMessages: "Loading messages...",
    read: "Read",
    scrollToBottom: "New messages",

    // Badges
    owner: "Owner",
    moderator: "Moderator",
    member: "Member",
    verified: "Verified",

    // Header
    start: "Start",
    stop: "Stop",

    // Sidebar
    notifications: "Notifications",
    settings: "Settings",
    history: "History",
    feedback: "Feedback",
    helpCenter: "Help Center",
    language: "Language",

    // Toasts
    botStarted: "Bot started successfully",
    botStopped: "Bot stopped",
    configSaved: "Configuration saved successfully",
    failedToStart: "Failed to start bot",
    failedToStop: "Failed to stop bot",
    failedToSave: "Failed to save configuration",
    invalidApiKey: "Invalid API key",

    // Upgrade card
    upgradeTitle: "YouTube Live TTS",
    upgradeDescription: "Open-source tool to convert YouTube live chat to speech using ElevenLabs AI voices.",
    madeBy: "Made by",
    viewOnGithub: "View on GitHub",

    // Search
    search: "Search...",

    // Status
    live: "Live",
    offline: "Offline",

    // Links
    github: "GitHub",

    // Command Menu
    searchPlaceholder: "Type a command or search...",
    noResults: "No results found.",
    navigation: "Navigation",
    bot: "Bot",
    startBot: "Start Bot",
    stopBot: "Stop Bot",
    theme: "Theme",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    systemMode: "System",

    // Appearance
    appearance: "Appearance",
    appearanceDescription: "Choose your accent color",

    // Onboarding Tour
    onboardingStartTour: "Start Tour",
    onboardingPrev: "Previous",
    onboardingNext: "Next",
    onboardingFinish: "Finish",
    onboardingSkip: "Skip",
    onboardingBack: "Back",
    onboardingContinue: "Continue",

    // Onboarding Steps
    onboardingStatsTitle: "Dashboard Statistics",
    onboardingStatsContent: "Monitor your bot's performance with real-time metrics: messages read, queue size, bot status, and YouTube connection.",
    onboardingApiKeyTitle: "ElevenLabs API Key",
    onboardingApiKeyContent: "Enter your ElevenLabs API key to enable text-to-speech. Get your key at elevenlabs.io.",
    onboardingVideoUrlTitle: "YouTube URL",
    onboardingVideoUrlContent: "Paste the URL of your YouTube live stream. The bot will read messages from this chat.",
    onboardingVoiceIdTitle: "Voice ID",
    onboardingVoiceIdContent: "Select which ElevenLabs voice to use. Find voice IDs in your ElevenLabs dashboard.",
    onboardingPrefixTitle: "TTS Prefix",
    onboardingPrefixContent: "Set a command prefix like '!tts' to filter messages. Leave empty to read all messages.",
    onboardingTemplateTitle: "Message Format",
    onboardingTemplateContent: "Customize how messages are read. Use {author} for the username and {message} for the text.",
    onboardingAudioTitle: "Audio Settings",
    onboardingAudioContent: "Adjust volume, speech speed, and cooldown between messages to fine-tune your TTS experience.",
    onboardingChatTitle: "Live Chat Monitor",
    onboardingChatContent: "Watch live chat messages appear here. Messages that get read will be marked with a checkmark.",
    onboardingControlTitle: "Start & Stop Control",
    onboardingControlContent: "Use this button to start or stop your TTS bot. Make sure you've configured your settings first.",
  },
  es: {
    // Dashboard
    dashboard: "Dashboard",

    // Stats
    messagesRead: "Mensajes leídos",
    inQueue: "En cola",
    botStatus: "Estado del bot",
    youtubeChat: "Chat de YouTube",
    running: "Activo",
    stopped: "Inactivo",
    connected: "Conectado",
    disconnected: "Desconectado",

    // Stats tooltips
    messagesTooltip: "Total de mensajes leídos en voz alta",
    queueTooltip: "Mensajes en espera de ser leídos",
    botTooltip: "Estado actual del bot",
    youtubeTooltip: "Estado de conexión al chat en vivo",

    // Configuration
    configuration: "Configuración",
    save: "Guardar",
    elevenLabsApiKey: "API Key de ElevenLabs",
    getApiKey: "Obtén tu API key",
    youtubeVideoId: "URL de YouTube",
    voiceId: "ID de voz",
    ttsPrefix: "Prefijo TTS (vacío = todos)",
    ttsTemplate: "Formato del mensaje",
    ttsTemplatePlaceholder: "{author} dice: {message}",
    ttsTemplateHint: "Usa {author} y {message} como marcadores",
    volume: "Volumen",
    speed: "Velocidad",
    cooldown: "Intervalo",

    // Live Chat
    liveChat: "Chat en vivo",
    noMessages: "Sin mensajes",
    messagesWillAppear: "Los mensajes aparecerán cuando el bot esté activo",
    loadingMessages: "Cargando mensajes...",
    read: "Leído",
    scrollToBottom: "Nuevos mensajes",

    // Badges
    owner: "Propietario",
    moderator: "Moderador",
    member: "Miembro",
    verified: "Verificado",

    // Header
    start: "Iniciar",
    stop: "Detener",

    // Sidebar
    notifications: "Notificaciones",
    settings: "Configuración",
    history: "Historial",
    feedback: "Feedback",
    helpCenter: "Ayuda",
    language: "Idioma",

    // Toasts
    botStarted: "Bot iniciado",
    botStopped: "Bot detenido",
    configSaved: "Configuración guardada",
    failedToStart: "Error al iniciar el bot",
    failedToStop: "Error al detener el bot",
    failedToSave: "Error al guardar",
    invalidApiKey: "API key inválida",

    // Upgrade card
    upgradeTitle: "YouTube Live TTS",
    upgradeDescription: "Herramienta open-source para convertir el chat en vivo de YouTube a voz usando ElevenLabs.",
    madeBy: "Creado por",
    viewOnGithub: "Ver en GitHub",

    // Search
    search: "Buscar...",

    // Status
    live: "En vivo",
    offline: "Desconectado",

    // Links
    github: "GitHub",

    // Command Menu
    searchPlaceholder: "Escribe un comando o busca...",
    noResults: "Sin resultados.",
    navigation: "Navegación",
    bot: "Bot",
    startBot: "Iniciar Bot",
    stopBot: "Detener Bot",
    theme: "Tema",
    lightMode: "Modo Claro",
    darkMode: "Modo Oscuro",
    systemMode: "Sistema",

    // Onboarding Tour
    onboardingStartTour: "Iniciar Tour",
    onboardingPrev: "Anterior",
    onboardingNext: "Siguiente",
    onboardingFinish: "Finalizar",
    onboardingSkip: "Omitir",
    onboardingBack: "Atrás",
    onboardingContinue: "Continuar",

    // Onboarding Steps
    onboardingStatsTitle: "Estadísticas del Dashboard",
    onboardingStatsContent: "Monitorea el rendimiento de tu bot con métricas en tiempo real: mensajes leídos, cola, estado del bot y conexión a YouTube.",
    onboardingApiKeyTitle: "API Key de ElevenLabs",
    onboardingApiKeyContent: "Ingresa tu API key de ElevenLabs para habilitar texto a voz. Obtén tu key en elevenlabs.io.",
    onboardingVideoUrlTitle: "URL de YouTube",
    onboardingVideoUrlContent: "Pega la URL de tu transmisión en vivo de YouTube. El bot leerá mensajes de este chat.",
    onboardingVoiceIdTitle: "ID de Voz",
    onboardingVoiceIdContent: "Selecciona qué voz de ElevenLabs usar. Encuentra los IDs en tu panel de ElevenLabs.",
    onboardingPrefixTitle: "Prefijo TTS",
    onboardingPrefixContent: "Configura un prefijo como '!tts' para filtrar mensajes. Déjalo vacío para leer todos.",
    onboardingTemplateTitle: "Formato del Mensaje",
    onboardingTemplateContent: "Personaliza cómo se leen los mensajes. Usa {author} para el usuario y {message} para el texto.",
    onboardingAudioTitle: "Ajustes de Audio",
    onboardingAudioContent: "Ajusta el volumen, velocidad del habla e intervalo entre mensajes para personalizar tu experiencia TTS.",
    onboardingChatTitle: "Monitor de Chat en Vivo",
    onboardingChatContent: "Observa los mensajes del chat aparecer aquí. Los mensajes leídos se marcarán con una palomita.",
    onboardingControlTitle: "Control de Inicio y Parada",
    onboardingControlContent: "Usa este botón para iniciar o detener tu bot TTS. Asegúrate de configurar tus ajustes primero.",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
