"use client";

import type { Step } from "onborda";
import { AnimatedLink } from "./animated-link";

export interface Tour {
  tour: string;
  steps: Step[];
}

const ElevenLabsLink = () => (
  <AnimatedLink href="https://elevenlabs.io/app/developers/api-keys">
    elevenlabs.io
  </AnimatedLink>
);

const VoiceLibraryLink = ({ label }: { label: string }) => (
  <AnimatedLink href="https://elevenlabs.io/app/voice-library">
    {label}
  </AnimatedLink>
);

export const getDashboardTourSteps = (language: "en" | "es"): Tour[] => {
  const isEnglish = language === "en";

  return [
    {
      tour: "dashboard",
      steps: [
        {
          icon: null,
          title: isEnglish ? "Dashboard Statistics" : "Estadísticas del Dashboard",
          content: isEnglish
            ? "Track messages read, queue size, and connection status at a glance."
            : "Ve las métricas de los mensajes leídos, mensajes en cola y el estado de conexión.",
          selector: "#onboarding-stats-container",
          side: "bottom",
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 12,
        },
        {
          icon: null,
          title: isEnglish ? "ElevenLabs API Key" : "API Key de ElevenLabs",
          content: isEnglish ? (
            <>
              Connect your ElevenLabs account. Grab your API key from{" "}
              <ElevenLabsLink />
            </>
          ) : (
            <>
              Agrega tu API key de ElevenLabs. Puedes generarla desde{" "}
              <ElevenLabsLink />
            </>
          ),
          selector: "#onboarding-api-key",
          side: "right",
          showControls: true,
          pointerPadding: 8,
          pointerRadius: 8,
        },
        {
          icon: null,
          title: isEnglish ? "YouTube URL" : "URL de YouTube",
          content: isEnglish
            ? "Paste your YouTube live stream URL. We'll monitor the chat for you."
            : "Pega la URL de tu transmisión en vivo de YouTube. Nosotros nos encargamos del resto.",
          selector: "#onboarding-video-url",
          side: "right",
          showControls: true,
          pointerPadding: 8,
          pointerRadius: 8,
        },
        {
          icon: null,
          title: isEnglish ? "Voice ID" : "ID de Voz",
          content: isEnglish ? (
            <>
              Choose your voice for reading messages. Discover over 5,000 voices in the{" "}
              <VoiceLibraryLink label="Voice Library" />
            </>
          ) : (
            <>
              Elige la voz para leer mensajes. Descubre más de 5,000 modelos en la{" "}
              <VoiceLibraryLink label="Biblioteca de Voces" />.
            </>
          ),
          selector: "#onboarding-voice-id",
          side: "right",
          showControls: true,
          pointerPadding: 8,
          pointerRadius: 8,
        },
        {
          icon: null,
          title: isEnglish ? "TTS Prefix" : "Prefijo TTS",
          content: isEnglish
            ? "Want to filter messages? Use a prefix like '!tts' or leave it empty to read everything."
            : "¿Quieres filtrar mensajes? Puedes especificar un prefijo como '!tts' o dejarlo vacío para leer todo.",
          selector: "#onboarding-tts-prefix",
          side: "right",
          showControls: true,
          pointerPadding: 8,
          pointerRadius: 8,
        },
        {
          icon: null,
          title: isEnglish ? "Message Format" : "Formato del Mensaje",
          content: isEnglish
            ? "Set how messages are read. Use {author} and {message} as placeholders to customize the message."
            : "Define cómo se leen los mensajes. Usa {author} y {message} como variables para personalizar el mensaje.",
          selector: "#onboarding-tts-template",
          side: "right",
          showControls: true,
          pointerPadding: 8,
          pointerRadius: 8,
        },
        {
          icon: null,
          title: isEnglish ? "Audio Settings" : "Ajustes de Audio",
          content: isEnglish
            ? "Adjust volume, speed, and cooldown between messages to fine-tune your Text to Speech (TTS) experience."
            : "Ajusta volumen, velocidad e intervalo entre mensajes para personalizar tu experiencia de Text to Speech (TTS).",
          selector: "#onboarding-audio-settings",
          side: "right",
          showControls: true,
          pointerPadding: 8,
          pointerRadius: 8,
        },
        {
          icon: null,
          title: isEnglish ? "Live Chat Monitor" : "Monitor de Chat en Vivo",
          content: isEnglish
            ? "Messages from your live chat will appear here in real-time."
            : "Los mensajes de tu chat en vivo aparecerán aquí en tiempo real.",
          selector: "#onboarding-right-panel",
          side: "left",
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 12,
        },
        {
          icon: null,
          title: isEnglish ? "Start & Stop Control" : "Control de Inicio y Parada",
          content: isEnglish
            ? "Ready to go? Start the TTS bot once you've configured your settings."
            : "Listo para empezar? Inicia el bot TTS una vez que hayas configurado los ajustes.",
          selector: "#onboarding-control-button",
          side: "bottom",
          showControls: true,
          pointerPadding: 8,
          pointerRadius: 8,
        },
      ],
    },
  ];
};
