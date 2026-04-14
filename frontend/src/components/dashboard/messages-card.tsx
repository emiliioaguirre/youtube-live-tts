"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence, useWillChange } from "framer-motion";
import { MessageSquare, Check, Crown, Shield, Star, BadgeCheck, Loader2, ArrowDown } from "lucide-react";
import { useDashboardStore, type MessagePart, type ChatMessage } from "@/store/dashboard-store";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function MessageContent({ parts }: { parts: MessagePart[] }) {
  return (
    <span className="break-words">
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <img
            key={i}
            src={part.url}
            alt={part.txt}
            className="inline-block size-5 align-middle mx-0.5"
          />
        )
      )}
    </span>
  );
}

const SPRING_CONFIG = {
  stiffness: 400,
  damping: 30,
};

const USER_BADGES = [
  { key: "is_owner", icon: Crown, color: "text-yellow-500", label: "owner" },
  { key: "is_moderator", icon: Shield, color: "text-blue-500", label: "moderator" },
  { key: "is_member", icon: Star, color: "text-green-500", label: "member" },
  { key: "is_verified", icon: BadgeCheck, color: "text-purple-500", label: "verified" },
] as const;

const MessageItem = memo(function MessageItem({ msg }: { msg: ChatMessage }) {
  const { t } = useTranslation();
  const initials = msg.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors",
        msg.was_read
          ? "bg-primary/5 border-l-2 border-primary"
          : "bg-muted/50"
      )}
    >
      <Avatar className="size-8 shrink-0">
        {msg.avatar_url && (
          <AvatarImage src={msg.avatar_url} alt={msg.author} />
        )}
        <AvatarFallback className="text-xs bg-secondary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-0.5 mb-0.5">
          <span className="text-sm font-medium truncate">
            {msg.author}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {USER_BADGES.map(({ key, icon: Icon, color, label }) =>
              msg[key] && (
                <Tooltip key={key}>
                  <TooltipTrigger>
                    <Icon className={`size-3.5 ${color}`} />
                  </TooltipTrigger>
                  <TooltipContent>{t(label)}</TooltipContent>
                </Tooltip>
              )
            )}
          </div>
          <span className="text-muted-foreground shrink-0 px-1">·</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {msg.timestamp}
          </span>
          {msg.was_read && (
            <span className="flex items-center gap-1 text-xs text-green-500 shrink-0">
              <Check className="size-3" />
              {t("read")}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {msg.message_parts && msg.message_parts.length > 0 ? (
            <MessageContent parts={msg.message_parts} />
          ) : (
            msg.message
          )}
        </p>
      </div>
    </div>
  );
});

function ScrollToBottomButton({
  show,
  hasNewMessages,
  onClick,
  label,
}: {
  show: boolean;
  hasNewMessages: boolean;
  onClick: () => void;
  label: string;
}) {
  const willChange = useWillChange();

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
      <AnimatePresence>
        {show && (
          <motion.button
            onClick={onClick}
            className={cn(
              "pointer-events-auto flex items-center justify-center overflow-hidden",
              "bg-secondary text-secondary-foreground",
              "shadow-lg border border-border",
              "hover:bg-secondary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            style={{
              willChange,
              borderRadius: 50,
            }}
            initial={{
              opacity: 0,
              scale: 0.8,
              filter: "blur(4px)",
              width: 40,
              height: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              width: hasNewMessages ? 160 : 40,
              height: 40,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              filter: "blur(4px)",
              width: 40,
              height: 40,
            }}
            transition={{
              type: "spring",
              ...SPRING_CONFIG,
            }}
          >
            <motion.div
              className="flex items-center justify-center gap-1.5"
              layout
              transition={{ type: "spring", ...SPRING_CONFIG }}
            >
              <ArrowDown className="size-4 shrink-0" />
              <AnimatePresence mode="wait">
                {hasNewMessages && (
                  <motion.span
                    key="label"
                    className="text-sm font-medium whitespace-nowrap tracking-[-0.3px]"
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.15 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MessagesCard() {
  const { messages, isLoading } = useDashboardStore();
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const prevMessagesLengthRef = useRef(messages.length);
  const isAtBottomRef = useRef(true);

  const checkIfAtBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const threshold = 50;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom();
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
    if (atBottom) {
      setHasNewMessages(false);
    }
  }, [checkIfAtBottom]);

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
    isAtBottomRef.current = true;
    setShowScrollButton(false);
    setHasNewMessages(false);
  }, []);

  useEffect(() => {
    const hasNew = messages.length > prevMessagesLengthRef.current;

    if (hasNew) {
      if (isAtBottomRef.current) {
        requestAnimationFrame(() => {
          const container = scrollContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasNewMessages(true);
      }
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  return (
    <TooltipProvider>
    <div
      id="onboarding-messages-card"
      className="relative rounded-xl border border-border bg-card p-6 h-full flex flex-col overflow-hidden"
      role="log"
      aria-label="Live chat messages"
      aria-live="polite"
    >
      <div className="mb-6 flex items-center gap-2 shrink-0">
        <MessageSquare className="size-4 text-muted-foreground" />
        <h2 className="text-[15px] font-normal text-foreground tracking-[-0.45px]">
          {t("liveChat")}
        </h2>
      </div>

      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="space-y-3 h-full overflow-y-auto no-scrollbar pb-8"
        >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Loader2 className="size-8 mb-3 animate-spin opacity-50" />
            <p className="text-sm">{t("loadingMessages")}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="size-12 mb-3 opacity-20" />
            <p className="text-sm">{t("noMessages")}</p>
            <p className="text-xs mt-1">
              {t("messagesWillAppear")}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))
        )}
        </div>
        <ScrollToBottomButton
          show={showScrollButton}
          hasNewMessages={hasNewMessages}
          onClick={scrollToBottom}
          label={t("scrollToBottom")}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </div>
    </div>
    </TooltipProvider>
  );
}
