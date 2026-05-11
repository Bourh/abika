/**
 * ABIKA PLUGIN LOADER
 * ────────────────────
 * This is how the core grows without being touched.
 *
 * A plugin can be anything:
 *   - A skill (cooking helper, code assistant, translator)
 *   - A tool (calculator, weather fetcher, browser)
 *   - A workflow (task manager, reminder system)
 *   - An AI capability (image analysis, voice input)
 *   - An automation (daily briefing, smart replies)
 *
 * To add a capability:
 *   1. Create a Plugin object
 *   2. Call core.plugins.register(myPlugin)
 *   3. Done. No core changes needed.
 */

import { IPluginLoader, Plugin, CoreAPI } from './types';

export class PluginLoader implements IPluginLoader {
  private registry = new Map<string, Plugin>();
  private core: CoreAPI;

  constructor(core: CoreAPI) {
    this.core = core;
  }

  async register(plugin: Plugin): Promise<void> {
    if (this.registry.has(plugin.id)) {
      console.warn(`[PluginLoader] Plugin "${plugin.id}" is already installed.`);
      return;
    }

    try {
      await plugin.install(this.core);
      this.registry.set(plugin.id, plugin);

      this.core.events.emit('plugin:installed', {
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
      });

      console.log(`[PluginLoader] ✓ Installed: ${plugin.name} v${plugin.version}`);
    } catch (err) {
      console.error(`[PluginLoader] Failed to install "${plugin.id}":`, err);
      throw err;
    }
  }

  async unregister(pluginId: string): Promise<void> {
    const plugin = this.registry.get(pluginId);
    if (!plugin) {
      console.warn(`[PluginLoader] Plugin "${pluginId}" is not installed.`);
      return;
    }

    try {
      await plugin.uninstall?.();
      this.registry.delete(pluginId);

      this.core.events.emit('plugin:uninstalled', { id: pluginId });

      console.log(`[PluginLoader] ✓ Uninstalled: ${plugin.name}`);
    } catch (err) {
      console.error(`[PluginLoader] Failed to uninstall "${pluginId}":`, err);
      throw err;
    }
  }

  get(pluginId: string): Plugin | undefined {
    return this.registry.get(pluginId);
  }

  getAll(): Plugin[] {
    return Array.from(this.registry.values());
  }

  isInstalled(pluginId: string): boolean {
    return this.registry.has(pluginId);
  }
}
