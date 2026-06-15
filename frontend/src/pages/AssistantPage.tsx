import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { askAssistant } from '../api';
import type { AssistantMessage, AssistantResponse } from '../types';
import {
  Bot, User, Send, ArrowRight, GitCompare,
  AlertTriangle, Lightbulb, Sparkles, Clock,
} from 'lucide-react';

const STARTER_QUESTIONS = [
  "What product is best for a freelancer?",
  "I have rental and investment income — which plan?",
  "Difference between Expert Assist and Expert Full Service?",
  "I run an incorporated company — what do I need?",
];

function MessageBubble({ msg }: { msg: AssistantMessage }) {
  const isUser = msg.role === 'user';

  const renderContent = (content: string) =>
    content.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={i < content.split('\n').length - 1 ? 'mb-2' : ''}>
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-white">{part}</strong> : part)}
        </p>
      );
    });

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-blue-600' : 'bg-slate-700 border border-white/10'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-white" />
          : <Bot className="w-4 h-4 text-blue-400" />
        }
      </div>
      {/* Bubble */}
      <div className={isUser ? 'bubble-user' : 'bubble-ai'}>
        {renderContent(msg.content)}
        <div className={`flex items-center gap-1 mt-2 text-xs ${isUser ? 'text-blue-200/60 justify-end' : 'text-slate-500'}`}>
          <Clock className="w-3 h-3" />
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center">
        <Bot className="w-4 h-4 text-blue-400" />
      </div>
      <div className="bubble-ai flex items-center gap-1.5 py-3.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([{
    id: 'welcome',
    role: 'assistant',
    content: "Hi! I'm the TaxWise AI assistant.\n\nI can help you find the right Canadian tax software product for your situation. Ask me anything about our products, or describe your tax situation and I'll suggest the best option.\n\nThis is general product guidance only and is not tax, legal, or financial advice.",
    timestamp: new Date(),
  }]);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [lastResponse, setLastResponse] = useState<AssistantResponse | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { document.title = 'AI Assistant — TaxWise AI'; }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  async function send(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: question, timestamp: new Date() }]);
    setInput('');
    setLoading(true);
    setLastResponse(null);

    try {
      const res = await askAssistant(question);
      setLastResponse(res);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.answer, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: "Sorry, I couldn't connect to the backend. Please make sure the server is running at localhost:8000.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <main className="page-wrapper bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">

          {/* ── Sidebar ── */}
          <aside className="lg:w-72 shrink-0 flex flex-col gap-4">
            {/* Title card */}
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">AI Assistant</div>
                  <div className="text-slate-500 text-xs">Powered by Groq LLaMA 3.3</div>
                </div>
              </div>
            </div>

            {/* Starter questions */}
            <div className="card p-5 flex-1 flex flex-col gap-3 overflow-y-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5" /> Try asking
              </div>
              {STARTER_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  id={`starter-${i}`}
                  disabled={loading}
                  onClick={() => send(q)}
                  className="text-left text-sm text-slate-300 hover:text-blue-400 p-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all disabled:opacity-50"
                >
                  {q}
                </button>
              ))}

              {/* Quick links */}
              <div className="mt-auto pt-3 border-t border-white/8 space-y-2">
                <Link to="/recommend" className="btn btn-primary btn-sm w-full" id="assistant-sidebar-wizard">
                  <ArrowRight className="w-3.5 h-3.5" /> Recommendation Wizard
                </Link>
                <Link to="/compare" className="btn btn-ghost btn-sm w-full" id="assistant-sidebar-compare">
                  <GitCompare className="w-3.5 h-3.5" /> Compare All Products
                </Link>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-400/80 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              General guidance only. Not tax, legal or financial advice.
            </div>
          </aside>

          {/* ── Chat area ── */}
          <div className="flex-1 flex flex-col card overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-hidden">
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

              {loading && <TypingIndicator />}

              {/* Product suggestion badge */}
              {lastResponse?.recommended_product && (
                <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="badge badge-green">Suggested: {lastResponse.recommended_product}</span>
                  {lastResponse.confidence && (
                    <span className={`badge ${lastResponse.confidence === 'high' ? 'badge-green' : lastResponse.confidence === 'medium' ? 'badge-yellow' : 'badge-purple'}`}>
                      {lastResponse.confidence} confidence
                    </span>
                  )}
                  <Link to="/recommend" className="btn btn-primary btn-sm ml-auto" id="assistant-cta-wizard">
                    Try Wizard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-white/8 bg-slate-900/50">
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  className="input flex-1 resize-none !min-h-[44px] max-h-32"
                  placeholder="Describe your tax situation or ask about our products…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                  maxLength={2000}
                  disabled={loading}
                  id="assistant-input"
                  style={{ height: 'auto' }}
                  onInput={e => {
                    const t = e.currentTarget;
                    t.style.height = 'auto';
                    t.style.height = Math.min(t.scrollHeight, 128) + 'px';
                  }}
                />
                <button
                  className="btn btn-primary w-11 h-11 p-0 shrink-0 rounded-xl"
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  id="assistant-send"
                  aria-label="Send message"
                >
                  {loading
                    ? <div className="spinner !w-4 !h-4 !border-2" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </div>
              <div className="text-slate-600 text-xs mt-2 text-right">
                {input.length}/2000 · Enter to send · Shift+Enter for new line
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
