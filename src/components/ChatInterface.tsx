import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Role = "user" | "ai";
interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

interface ChatInterfaceProps {
  title: string;
  description?: string;
}

export default function ChatInterface({ title, description }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "ai",
      content: `Welcome to ${title}. Ask me anything to get started.`,
    },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = `${title} | PromptCraft`;
    const metaName = "description";
    const desc = description || `${title} lab with an AI chat interface.`;
    let meta = document.querySelector(`meta[name="${metaName}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", metaName);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [title, description]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulated AI response placeholder
    const reply: ChatMessage = {
      id: crypto.randomUUID(),
      role: "ai",
      content: `This is a placeholder response for ${title}. Connect your AI backend to enable real replies.`,
    };
    setTimeout(() => setMessages((prev) => [...prev, reply]), 400);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const headingId = useMemo(() => `${title.replace(/\s+/g, "-").toLowerCase()}-heading`, [title]);

  return (
    <main className="container max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 id={headingId} className="text-2xl font-semibold">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-1">{description}</p>
        ) : null}
      </header>

      <section aria-labelledby={headingId} className="space-y-4">
        <Card className="p-0">
          <ScrollArea className="h-[56vh]" ref={listRef as React.RefObject<HTMLDivElement>}>
            <div className="p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="flex">
                  <div
                    className={
                      m.role === "user"
                        ? "ml-auto max-w-[85%] rounded-lg bg-primary/10 text-foreground px-3 py-2"
                        : "mr-auto max-w-[85%] rounded-lg bg-muted text-foreground px-3 py-2"
                    }
                    aria-label={m.role === "user" ? "User message" : "AI message"}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Message ${title}...`}
            className="min-h-[56px]"
            aria-label="Chat message"
          />
          <Button onClick={handleSend} aria-label="Send message">
            Send
          </Button>
        </div>
      </section>
    </main>
  );
}
