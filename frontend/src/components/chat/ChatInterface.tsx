import { useState, type FormEvent } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { generateId, cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: "Hi! I'm the DevOpsGPT assistant. Ask me a follow-up question about this analysis, or paste a new error to get started.",
  },
];

// TODO(flask-integration): replace local echo logic with a real streaming
// call to POST /debugger/chat once the LLM backend is available.
export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: generateId('msg'), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId('msg'),
          role: 'assistant',
          content:
            "That's a great follow-up — once connected to the backend, I'll pull the most relevant runbook sections and give you a precise next step.",
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={cn('flex items-start gap-2.5', message.role === 'user' && 'flex-row-reverse')}>
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                message.role === 'assistant' ? 'bg-primary-muted text-primary' : 'bg-bg-elevated text-text-secondary'
              )}
            >
              {message.role === 'assistant' ? <Bot size={14} /> : <UserIcon size={14} />}
            </div>
            <div
              className={cn(
                'max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                message.role === 'assistant'
                  ? 'bg-bg-elevated text-text-secondary'
                  : 'bg-primary text-white'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Bot size={14} className="text-primary" />
            Typing...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          aria-label="Chat message"
          className="input-field"
        />
        <button type="submit" aria-label="Send message" className="btn-primary !px-3">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
