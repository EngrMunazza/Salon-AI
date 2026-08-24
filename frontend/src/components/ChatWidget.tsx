import { useEffect, useRef, useState, type FormEvent } from 'react';
import { sendChatMessage, clearChatSession } from '@/lib/api';
import { salonInfo } from '@/data/salonInfo';
import { useChat } from '@/context/ChatContext';

type Message = { role: 'user' | 'assistant'; content: string };

const SESSION_KEY = 'salon_chat_session_id';
const HISTORY_KEY = 'salon_chat_history';

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export default function ChatWidget() {
  const { isOpen, setIsOpen, pendingMessage, clearPendingMessage } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // ignore corrupted history
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // When a "Book" button elsewhere on the site queues a message, send it
  // automatically once the widget (and a session id) is ready.
  useEffect(() => {
    if (isOpen && pendingMessage && sessionId) {
      void sendMessage(pendingMessage);
      clearPendingMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pendingMessage, sessionId]);

  async function sendMessage(text: string) {
    if (!text.trim() || !sessionId) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    setError(null);

    try {
      const res = await sendChatMessage(sessionId, text);
      setMessages((m) => [...m, { role: 'assistant', content: res.response }]);
    } catch {
      setError("Couldn't reach the salon assistant. Check the API is running, then try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    await sendMessage(text);
  }

  async function handleReset() {
    if (sessionId) await clearChatSession(sessionId);
    setMessages([]);
    localStorage.removeItem(HISTORY_KEY);
    setError(null);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Chat with the salon assistant'}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-rose text-blush shadow-soft flex items-center justify-center hover:bg-rose-dark transition-colors"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M4 4 L18 18 M18 4 L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 12c0-4.4 3.8-8 8.5-8S21 7.6 21 12s-3.8 8-8.5 8c-1 0-1.9-.15-2.8-.44L5 21l1.2-3.9C4.8 15.9 4 14 4 12Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm rounded-2xl rounded-tr-none bg-white shadow-soft border border-line overflow-hidden flex flex-col max-h-[70vh]">
          <div className="bg-espresso text-blush px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-display text-lg leading-tight">{salonInfo.name} Assistant</p>
              <p className="text-xs text-blush/60">Ask about services, prices, hours or booking</p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs uppercase tracking-wide text-blush/60 hover:text-gold-light"
              aria-label="Reset conversation"
            >
              Reset
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-blush">
            {messages.length === 0 && (
              <p className="text-sm text-espresso/60 leading-relaxed">
                Aap Urdu, Roman Urdu ya English mein baat kar sakte hain; ask about services, prices, timings, or
                say something like "book a haircut tomorrow at 3pm" to reserve a slot. You can also reschedule or
                cancel an existing booking, or ask which stylist to book with.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'ml-auto bg-rose text-blush rounded-br-sm'
                    : 'mr-auto bg-white text-espresso border border-line rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-white text-espresso/50 border border-line rounded-2xl rounded-bl-sm px-4 py-2 text-sm">
                Typing…
              </div>
            )}
            {error && <p className="text-xs text-rose-dark">{error}</p>}
          </div>

          <form onSubmit={handleSend} className="border-t border-line p-3 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-line px-4 py-2 text-sm focus:outline-none focus:border-rose"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-espresso text-blush px-4 py-2 text-sm disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
