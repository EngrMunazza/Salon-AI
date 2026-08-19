import { createContext, useContext, useState, type ReactNode } from 'react';

type ChatContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pendingMessage: string | null;
  /** Opens the widget and queues a message to be auto-sent, e.g. from a "Book" button on a service card. */
  openWithMessage: (message: string) => void;
  /** Called by ChatWidget once it has consumed pendingMessage. */
  clearPendingMessage: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  function openWithMessage(message: string) {
    setPendingMessage(message);
    setIsOpen(true);
  }

  function clearPendingMessage() {
    setPendingMessage(null);
  }

  return (
    <ChatContext.Provider value={{ isOpen, setIsOpen, pendingMessage, openWithMessage, clearPendingMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
