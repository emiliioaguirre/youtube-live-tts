import { create } from "zustand";

export interface EmojiPart {
  id: string;
  txt: string;
  url: string;
}

export type MessagePart = string | EmojiPart;

export interface ChatMessage {
  id: string;
  author: string;
  message: string;
  message_parts?: MessagePart[];
  timestamp: string;
  was_read: boolean;
  avatar_url?: string;
  is_owner?: boolean;
  is_moderator?: boolean;
  is_member?: boolean;
  is_verified?: boolean;
}

export interface Config {
  elevenlabs_api_key: string;
  voice_id: string;
  video_id: string;
  tts_prefix: string;
  tts_template: string;
  max_message_length: number;
  cooldown_seconds: number;
  speed: number;
  volume: number;
}

export interface Status {
  running: boolean;
  connected: boolean;
  messages_read: number;
  queue_size: number;
}

export interface Stat {
  id: string;
  value: string | number;
  icon: "messages" | "queue" | "bot" | "youtube";
  status?: "active" | "inactive";
}

export type WsConnectionState = "connected" | "disconnected" | "reconnecting";

interface DashboardStore {
  // State
  messages: ChatMessage[];
  config: Config;
  status: Status;
  wsConnected: boolean;
  wsConnectionState: WsConnectionState;
  stats: Stat[];
  isLoading: boolean;

  // Actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setConfig: (config: Partial<Config>) => void;
  setStatus: (status: Partial<Status>) => void;
  setWsConnected: (connected: boolean) => void;
  setWsConnectionState: (state: WsConnectionState) => void;
  updateStats: () => void;
  saveConfig: () => Promise<{ success: boolean; api_key_valid: boolean | null }>;
  startBot: () => Promise<void>;
  stopBot: () => Promise<void>;
  fetchStatus: () => Promise<void>;
  loadConfigFromStorage: () => void;
  reset: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const defaultConfig: Config = {
  elevenlabs_api_key: "",
  voice_id: "FGY2WhTYpPnrIDTdsKH5",
  video_id: "",
  tts_prefix: "",
  tts_template: "{author} says: {message}",
  max_message_length: 200,
  cooldown_seconds: 5,
  speed: 0.85,
  volume: 1.0,
};

const STORAGE_KEY = "tts-bot-config";

const defaultStatus: Status = {
  running: false,
  connected: false,
  messages_read: 0,
  queue_size: 0,
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  messages: [],
  config: defaultConfig,
  status: defaultStatus,
  wsConnected: false,
  wsConnectionState: "disconnected" as WsConnectionState,
  isLoading: false,
  stats: [
    { id: "1", value: 0, icon: "messages" },
    { id: "2", value: 0, icon: "queue" },
    { id: "3", value: "Stopped", icon: "bot", status: "inactive" },
    { id: "4", value: "Disconnected", icon: "youtube", status: "inactive" },
  ],

  setMessages: (messages) => set({ messages, isLoading: false }),

  addMessage: (message) =>
    set((state) => ({
      // keep last 500 messages for memory efficiency
      messages: [...state.messages.slice(-499), message],
    })),

  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),

  setStatus: (newStatus) => {
    set((state) => ({
      status: { ...state.status, ...newStatus },
    }));
    get().updateStats();
  },

  setWsConnected: (wsConnected) => set({
    wsConnected,
    isLoading: wsConnected,
    wsConnectionState: wsConnected ? "connected" : "disconnected"
  }),

  setWsConnectionState: (wsConnectionState) => set({ wsConnectionState }),

  updateStats: () => {
    const { status } = get();
    set({
      stats: [
        { id: "1", value: status.messages_read, icon: "messages" },
        { id: "2", value: status.queue_size, icon: "queue" },
        {
          id: "3",
          value: status.running ? "Running" : "Stopped",
          icon: "bot",
          status: status.running ? "active" : "inactive",
        },
        {
          id: "4",
          value: status.connected ? "Connected" : "Disconnected",
          icon: "youtube",
          status: status.connected ? "active" : "inactive",
        },
      ],
    });
  },

  saveConfig: async () => {
    const { config } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    try {
      const res = await fetch(`${API_URL}/api/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        console.error('Failed to save config:', res.status);
        return { success: false, api_key_valid: null };
      }
      return res.json();
    } catch (error) {
      console.error('Failed to save config:', error);
      return { success: false, api_key_valid: null };
    }
  },

  startBot: async () => {
    const { config } = get();

    try {
      await fetch(`${API_URL}/api/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const res = await fetch(`${API_URL}/api/start`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        set((state) => ({
          status: { ...state.status, running: true },
        }));
        get().updateStats();
      }
    } catch (error) {
      console.error('Failed to start bot:', error);
    }
  },

  stopBot: async () => {
    try {
      await fetch(`${API_URL}/api/stop`, { method: "POST" });
    } catch (error) {
      console.error('Failed to stop bot:', error);
    }
    set((state) => ({
      status: { ...state.status, running: false, connected: false },
    }));
    get().updateStats();
  },

  fetchStatus: async () => {
    try {
      const res = await fetch(`${API_URL}/api/status`);
      if (res.ok) {
        const data = await res.json();
        set({ status: data });
        get().updateStats();
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  },

  loadConfigFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedConfig = JSON.parse(saved);
        // Ensure tts_template is valid (must contain {message})
        if (!savedConfig.tts_template?.includes("{message}")) {
          savedConfig.tts_template = defaultConfig.tts_template;
        }
        set((state) => ({
          config: { ...state.config, ...savedConfig },
        }));
      }
    } catch (error) {
      console.error('Failed to load config from storage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  reset: () => {
    set({
      messages: [],
      status: defaultStatus,
      wsConnected: false,
    });
    get().updateStats();
  },
}));
