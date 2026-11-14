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
      <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-md bg-surface border-l border-border shadow-lift flex flex-col h-full animate-in slide-in-from-right duration-300 ease-premium">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-canvas">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand text-brass shadow-card flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brass" />
            </div>
            <h2 className="text-base font-bold text-ink tracking-tight font-serif sm:font-sans">PathFinder AI</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors"
            aria-label="Close AI"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas/40">
          {messages.length === 0 && (
            <div className="text-center py-10 px-4">
              <div className="w-10 h-10 rounded-full bg-brand-light text-brass flex items-center justify-center mx-auto mb-3 border border-brand-border">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-ink">How can I assist your studies?</p>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed max-w-xs mx-auto">
                Ask clarifying questions about curriculum roadmaps, core topics, or technical prerequisites.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[88%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-b from-[#7A5636] to-[#5C3F27] text-[#FBF8F3] border border-[#6B4A2F] shadow-card'
                    : 'bg-surface border border-border text-ink shadow-soft'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border rounded-xl px-4 py-2.5 text-xs text-ink-muted flex items-center gap-2 shadow-soft">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brass" />
                <span>Refining response...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-danger-light border border-danger-border text-danger text-xs leading-relaxed shadow-soft">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-border bg-surface flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about roadmaps or topics..."
            className="flex-1 px-3 py-2 text-sm bg-surface-subtle text-ink placeholder:text-ink-faint rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand shadow-soft"
          />
          <Button type="submit" size="md" disabled={!input.trim() || loading} className="shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </aside>
    </div>
  );
}
