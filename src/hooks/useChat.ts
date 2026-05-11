/**
 * useChat HOOK
 * ─────────────
 * Owns all chat interaction logic.
 * The UI is dumb — it just calls this hook and renders what it gets.
 *
 * Responsibilities:
 *   - Build messages list
 *   - Send user message to AI
 *   - Store everything in memory
 *   - Emit events for plugins to react
 *   - Handle loading and error states
 */

import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { Message } from '../core/types';
import { useAbika } from '../context/AbikaContext';

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export function useChat(): UseChatReturn {
  const { core, isReady } = useAbika();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!isReady || isLoading || !content.trim()) return;

    setError(null);

    // 1. Create and store user message
    const userMsg: Message = {
      id: uuid(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    core.memory.addMessage(userMsg);
    setMessages(core.memory.getMessages());
    core.events.emit('message:sent', userMsg);

    setIsLoading(true);

    try {
      // 2. Call AI with full history
      const response = await core.ai.chat(core.memory.getMessages());

      // 3. Store AI response
      const assistantMsg: Message = {
        id: uuid(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        metadata: { usage: response.usage },
      };

      core.memory.addMessage(assistantMsg);
      setMessages(core.memory.getMessages());
      core.events.emit('message:received', assistantMsg);
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(errorText);
      core.events.emit('message:error', { error: errorText });
    } finally {
      setIsLoading(false);
    }
  }, [core, isReady, isLoading]);

  const clearChat = useCallback(() => {
    core.memory.clearMessages();
    setMessages([]);
    setError(null);
  }, [core]);

  return { messages, isLoading, error, sendMessage, clearChat };
}
