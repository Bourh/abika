import { useState, useCallback } from 'react';
import { Message } from '../core/types';
import { useAbika } from '../context/AbikaContext';

const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

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
    const userMsg: Message = {
      id: genId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };
    core.memory.addMessage(userMsg);
    setMessages(core.memory.getMessages());
    core.events.emit('message:sent', userMsg);
    setIsLoading(true);
    try {
      const response = await core.ai.chat(core.memory.getMessages());
      const assistantMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        metadata: { usage: response.usage },
      };
      core.memory.addMessage(assistantMsg);
      setMessages(core.memory.getMessages());
      core.events.emit('message:received', assistantMsg);
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Something went wrong';
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
