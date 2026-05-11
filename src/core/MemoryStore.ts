/**
 * ABIKA MEMORY STORE
 * ───────────────────
 * Two layers of memory:
 *
 * SHORT-TERM  → In-memory array. Current conversation. Fast. Volatile.
 * LONG-TERM   → AsyncStorage. Persists across sessions. Survives app restarts.
 *
 * Future plugins can add:
 *   - Vector embeddings for semantic recall
 *   - User profile learning
 *   - Skill-specific memory namespaces
 *   - Encryption layer
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMemoryStore, Message, MemoryEntry } from './types';

const STORAGE_PREFIX = '@abika:memory:';

export class MemoryStore implements IMemoryStore {
  private messages: Message[] = [];

  // ─── Short-term (in-memory) ────────────────────────────────────────────────

  getMessages(): Message[] {
    return [...this.messages];
  }

  addMessage(msg: Message): void {
    this.messages.push(msg);
    // Keep last 100 messages in memory to avoid bloat
    if (this.messages.length > 100) {
      this.messages = this.messages.slice(-100);
    }
  }

  clearMessages(): void {
    this.messages = [];
  }

  // ─── Long-term (persistent) ────────────────────────────────────────────────

  async remember(key: string, value: unknown, ttl?: number): Promise<void> {
    const entry: MemoryEntry = {
      key,
      value,
      createdAt: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined,
    };
    try {
      await AsyncStorage.setItem(
        STORAGE_PREFIX + key,
        JSON.stringify(entry)
      );
    } catch (err) {
      console.error('[MemoryStore] Failed to save:', err);
    }
  }

  async recall<T = unknown>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return null;

      const entry: MemoryEntry = JSON.parse(raw);

      // Check TTL expiry
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        await this.forget(key);
        return null;
      }

      return entry.value as T;
    } catch (err) {
      console.error('[MemoryStore] Failed to recall:', err);
      return null;
    }
  }

  async forget(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_PREFIX + key);
    } catch (err) {
      console.error('[MemoryStore] Failed to forget:', err);
    }
  }

  async snapshot(): Promise<Record<string, unknown>> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const abikaKeys = keys.filter(k => k.startsWith(STORAGE_PREFIX));
      const pairs = await AsyncStorage.multiGet(abikaKeys);

      const result: Record<string, unknown> = {};
      for (const [key, raw] of pairs) {
        if (!raw) continue;
        try {
          const entry: MemoryEntry = JSON.parse(raw);
          const cleanKey = key.replace(STORAGE_PREFIX, '');

          // Skip expired
          if (entry.expiresAt && Date.now() > entry.expiresAt) continue;

          result[cleanKey] = entry.value;
        } catch {
          // ignore corrupt entries
        }
      }
      return result;
    } catch (err) {
      console.error('[MemoryStore] Snapshot failed:', err);
      return {};
    }
  }
}
