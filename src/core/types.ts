/**
 * ABIKA CORE TYPES
 * ─────────────────
 * These interfaces are the DNA of the system.
 * Everything that exists or will ever exist is defined here.
 * Adding a feature = adding/extending an interface, never breaking existing ones.
 */

// ─── Messages ─────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// ─── Memory ───────────────────────────────────────────────────────────────────

export interface MemoryEntry {
  key: string;
  value: unknown;
  createdAt: number;
  expiresAt?: number; // optional TTL
}

export interface IMemoryStore {
  /** Short-term: current conversation messages */
  getMessages(): Message[];
  addMessage(msg: Message): void;
  clearMessages(): void;

  /** Long-term: persistent key-value facts */
  remember(key: string, value: unknown, ttl?: number): Promise<void>;
  recall<T = unknown>(key: string): Promise<T | null>;
  forget(key: string): Promise<void>;
  snapshot(): Promise<Record<string, unknown>>;
}

// ─── AI Engine ────────────────────────────────────────────────────────────────

export interface AIConfig {
  model: string;
  maxTokens: number;
  systemPrompt: string;
  temperature?: number;
  apiKey: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface IAIEngine {
  chat(messages: Message[]): Promise<AIResponse>;
  updateConfig(partial: Partial<AIConfig>): void;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type EventHandler<T = unknown> = (payload: T) => void;

export interface IEventBus {
  on<T = unknown>(event: string, handler: EventHandler<T>): void;
  off<T = unknown>(event: string, handler: EventHandler<T>): void;
  emit<T = unknown>(event: string, payload?: T): void;
  once<T = unknown>(event: string, handler: EventHandler<T>): void;
}

// ─── Plugins ──────────────────────────────────────────────────────────────────

/**
 * A Plugin is the unit of extension.
 * Install one to add a skill, tool, workflow, or capability.
 * The core doesn't know what plugins do — it just loads them.
 */
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  /** Called once when the plugin is registered */
  install(core: CoreAPI): void | Promise<void>;
  /** Called when the plugin is removed */
  uninstall?(): void | Promise<void>;
}

export interface IPluginLoader {
  register(plugin: Plugin): Promise<void>;
  unregister(pluginId: string): Promise<void>;
  get(pluginId: string): Plugin | undefined;
  getAll(): Plugin[];
  isInstalled(pluginId: string): boolean;
}

// ─── Core API (injected into every plugin) ───────────────────────────────────

/**
 * This is what every plugin receives.
 * The full power of the core, exposed through clean interfaces.
 * Plugins can listen to events, store memories, call the AI, or load more plugins.
 */
export interface CoreAPI {
  events: IEventBus;
  memory: IMemoryStore;
  ai: IAIEngine;
  plugins: IPluginLoader;
}

// ─── Built-in Event Map ───────────────────────────────────────────────────────
// These are the system-level events. Modules can add their own.

export type AbikaEvent =
  | 'core:ready'
  | 'message:sent'
  | 'message:received'
  | 'message:error'
  | 'plugin:installed'
  | 'plugin:uninstalled'
  | 'memory:updated';
