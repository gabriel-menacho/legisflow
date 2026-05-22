"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { ChatMessage, ChatThread } from "@legisflow/shared";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function AssistantPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("portal.assistant");

  const loadThreads = useCallback(() => {
    api.listThreads().then((list) => {
      setThreads(list);
      if (list.length) setActiveId((prev) => prev ?? list[0].id);
    });
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    api.listMessages(activeId).then(setMessages);
  }, [activeId]);

  const newThread = async () => {
    const thread = await api.createThread();
    setThreads((prev) => [thread, ...prev]);
    setActiveId(thread.id);
    setMessages([]);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    setMessages((m) => [
      ...m,
      { id: "temp-user", role: "user", content, created_at: new Date().toISOString() },
    ]);
    try {
      const reply = await api.sendMessage(activeId, content);
      setMessages((m) => [
        ...m.filter((x) => x.id !== "temp-user"),
        { id: "temp-user", role: "user", content, created_at: new Date().toISOString() },
        reply,
      ]);
      loadThreads();
    } catch {
      toast(t("sendFailed"), "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 md:flex-row">
      <aside className="glass-panel w-full shrink-0 p-4 md:w-56">
        <Button onClick={newThread} className="mb-4 w-full text-xs">
          {t("newThread")}
        </Button>
        <div className="max-h-64 space-y-1 overflow-y-auto md:max-h-[calc(100vh-12rem)]">
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveId(thread.id)}
              className={`block w-full truncate px-2 py-2 text-left text-sm ${
                activeId === thread.id ? "bg-surface-container text-primary-container" : "text-on-surface-variant"
              }`}
            >
              {thread.title}
            </button>
          ))}
        </div>
      </aside>
      <div className="glass-panel flex flex-1 flex-col">
        {!activeId ? (
          <div className="flex flex-1 items-center justify-center text-on-surface-variant">{t("empty")}</div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] p-4 ${m.role === "user" ? "ml-auto bg-surface-container-high" : "glass-panel"}`}
                >
                  <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 border-t border-outline-variant pt-2">
                      <p className="mb-1 text-xs uppercase text-primary-container">{t("citations")}</p>
                      {m.citations.map((c, i) => (
                        <p key={i} className="text-xs italic text-on-surface-variant">
                          [{c.filename}] {c.excerpt}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-outline-variant p-4">
              <label htmlFor="assistant-input" className="sr-only">
                {t("placeholder")}
              </label>
              <input
                id="assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="scanline-input flex-1 border-0 border-b border-outline-variant bg-transparent py-2 focus:border-primary-container"
              />
              <Button type="submit" disabled={sending}>
                {sending ? t("thinking") : t("send")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
