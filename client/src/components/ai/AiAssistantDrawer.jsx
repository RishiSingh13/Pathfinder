import React, { useState } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../ui/Button';

export default function AiAssistantDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const sendMessage = async (e) => {
    e.preventDefault();
    const clean = input.trim();
    if (!clean || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: clean }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await api.ai.chat({ message: clean });
      setMessages((prev) => [...prev, { role: 'model', text: res.data?.reply || '' }]);
    } catch (err) {
      setError(err.message || 'Could not reach PathFinder AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="PathFinder AI">
      <div className="fixed inset-0 bg-ink/35 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col h-full">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-canvas">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-ink">PathFinder AI</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-surface-subtle"
            aria-label="Close AI"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas/60">
          {messages.length === 0 && (
            <p className="text-xs text-ink-muted">Ask anything about roadmaps, topics, or engineering concepts.</p>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[88%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  msg.role === 'user' ? 'bg-brand text-white' : 'bg-surface border border-border text-ink'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Loader2 className="w-4 h-4 animate-spin text-brand" />
              <span>Thinking...</span>
            </div>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-border bg-surface flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask PathFinder AI..."
            disabled={loading}
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <Button type="submit" size="md" disabled={loading || !input.trim()} aria-label="Send">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </aside>
    </div>
  );
}
