"use client";

import { useEffect, useRef, useCallback } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useDashboardStore } from "@/store/dashboard-store";
import { useOnboarding } from "@/components/onboarding/use-onboarding";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { showWelcome, startTour, closeTour } = useOnboarding({ autoStart: true });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {
    setMessages,
    addMessage,
    setStatus,
    setWsConnected,
    setWsConnectionState,
    updateStats,
    fetchStatus,
    loadConfigFromStorage,
  } = useDashboardStore();

  useEffect(() => {
    loadConfigFromStorage();
    fetchStatus();
  }, [loadConfigFromStorage, fetchStatus]);

  const connect = useCallback(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws";

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
      setWsConnectionState("connected");
      reconnectAttemptRef.current = 0;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "connected") {
        setStatus(data.data.status);
        setMessages(data.data.history);
        updateStats();
      } else if (data.event === "new_message") {
        addMessage(data.data);
      } else if (data.event === "status") {
        setStatus(data.data);
      } else if (data.event === "message_read") {
        setStatus({ messages_read: data.data.total });
      } else if (data.event === "queue_update") {
        setStatus({ queue_size: data.data.size });
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
      wsRef.current = null;

      if (reconnectAttemptRef.current < MAX_RECONNECT_ATTEMPTS) {
        setWsConnectionState("reconnecting");
        const delay = Math.min(
          INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptRef.current),
          MAX_RECONNECT_DELAY
        );
        reconnectAttemptRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      } else {
        setWsConnectionState("disconnected");
      }
    };

    ws.onerror = () => {};

    wsRef.current = ws;
  }, [setMessages, addMessage, setStatus, setWsConnected, setWsConnectionState, updateStats]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar
        showWelcome={showWelcome}
        onWelcomeNext={startTour}
        onWelcomeClose={closeTour}
      />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
