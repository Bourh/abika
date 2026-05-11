/**
 * ABIKA CORE
 * ───────────
 * The nucleus. The single source of truth.
 *
 * This class:
 *   1. Creates all core systems
 *   2. Wires them together
 *   3. Exposes the CoreAPI to plugins
 *   4. Boots the system
 *
 * It is initialized ONCE and shared everywhere via React Context.
 * Never recreate it. Never bypass it. Everything goes through here.
 *
 * Usage:
 *   const core = AbikaCore.create(config)
 *   await core.boot()
 */

import { EventBus } from './EventBus';
import { MemoryStore } from './MemoryStore';
import { AIEngine } from './AIEngine';
import { PluginLoader } from './PluginLoader';
import { CoreAPI, AIConfig, Plugin } from './types';

export interface AbikaBootConfig {
  ai: AIConfig;
  /** Plugins to install at startup */
  plugins?: Plugin[];
}

export class AbikaCore {
  readonly events: EventBus;
  readonly memory: MemoryStore;
  readonly ai: AIEngine;
  readonly plugins: PluginLoader;

  private constructor(config: AbikaBootConfig) {
    this.events = new EventBus();
    this.memory = new MemoryStore();
    this.ai = new AIEngine(config.ai);

    // Build the CoreAPI object that plugins receive
    const coreAPI: CoreAPI = {
      events: this.events,
      memory: this.memory,
      ai: this.ai,
      plugins: null as unknown as PluginLoader, // set below
    };

    this.plugins = new PluginLoader(coreAPI);
    // Patch the circular reference
    (coreAPI as { plugins: PluginLoader }).plugins = this.plugins;
  }

  static create(config: AbikaBootConfig): AbikaCore {
    return new AbikaCore(config);
  }

  async boot(extraPlugins?: Plugin[]): Promise<void> {
    console.log('[AbikaCore] Booting...');

    // Install startup plugins if any
    const allPlugins = [...(extraPlugins ?? [])];
    for (const plugin of allPlugins) {
      await this.plugins.register(plugin);
    }

    this.events.emit('core:ready', { timestamp: Date.now() });
    console.log('[AbikaCore] ✓ Ready');
  }

  /** Expose as the CoreAPI interface for plugins */
  get api(): CoreAPI {
    return {
      events: this.events,
      memory: this.memory,
      ai: this.ai,
      plugins: this.plugins,
    };
  }
}
