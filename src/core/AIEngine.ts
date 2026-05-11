/**
 * ABIKA AI ENGINE
 * ────────────────
 * The intelligence layer. Wraps the Anthropic API.
 *
 * This is intentionally thin. It:
 *   - Takes messages → returns a response
 *   - Is configurable (model, system prompt, temperature)
 *   - Can be swapped for another provider without touching anything else
 *
 * Future plugins can extend this with:
 *   - Function calling / tool use
 *   - Streaming responses
 *   - Multi-modal inputs (images, voice)
 *   - Local model fallback
 *   - Response caching
 */

import { IAIEngine, AIConfig, AIResponse, Message } from './types';

export class AIEngine implements IAIEngine {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async chat(messages: Message[]): Promise<AIResponse> {
    // Build the messages array for the API
    // Filter out system messages (they go in the system parameter)
    const apiMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const body = {
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      system: this.config.systemPrompt,
      messages: apiMessages,
      ...(this.config.temperature !== undefined && {
        temperature: this.config.temperature,
      }),
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`[AIEngine] API Error ${response.status}: ${error}`);
    }

    const data = await response.json();

    const content = data.content
      ?.filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('') ?? '';

    return {
      content,
      usage: {
        inputTokens: data.usage?.input_tokens ?? 0,
        outputTokens: data.usage?.output_tokens ?? 0,
      },
    };
  }

  updateConfig(partial: Partial<AIConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  getConfig(): Readonly<AIConfig> {
    return { ...this.config, apiKey: '***' }; // never expose the key
  }
}
