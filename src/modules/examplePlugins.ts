/**
 * EXAMPLE PLUGINS
 * ────────────────
 * These show exactly how to extend Abika without touching the core.
 *
 * To install any plugin:
 *   await core.plugins.register(myPlugin)
 *
 * That's it. No core changes. No rebuilding.
 */

import { Plugin, CoreAPI } from '../core/types';

// ─── Plugin 1: Logger ─────────────────────────────────────────────────────────
// Logs all messages to the console. Simple demonstration.

export const LoggerPlugin: Plugin = {
  id: 'logger',
  name: 'Message Logger',
  version: '1.0.0',
  description: 'Logs all sent and received messages',

  install(core: CoreAPI) {
    core.events.on('message:sent', (msg) => {
      console.log('[Logger] 📤 User:', (msg as { content: string }).content?.slice(0, 50));
    });

    core.events.on('message:received', (msg) => {
      console.log('[Logger] 📥 Abika:', (msg as { content: string }).content?.slice(0, 50));
    });
  },

  uninstall() {
    // EventBus handlers are cleaned up if you hold references
    // For now this is a simple demo
    console.log('[Logger] Plugin removed');
  },
};

// ─── Plugin 2: User Name Memory ───────────────────────────────────────────────
// Remembers the user's name across sessions.

export const UserMemoryPlugin: Plugin = {
  id: 'user-memory',
  name: 'User Memory',
  version: '1.0.0',
  description: 'Remembers user information across sessions',

  async install(core: CoreAPI) {
    // Recall any saved user info and inject into AI system prompt
    const userName = await core.memory.recall<string>('user:name');
    if (userName) {
      core.ai.updateConfig({
        systemPrompt: `أنت أبيكا. اسم المستخدم هو ${userName}. ناديه باسمه بشكل طبيعي.`,
      });
    }

    // Listen for messages and try to detect names
    core.events.on('message:sent', async (rawMsg) => {
      const msg = rawMsg as { content: string };
      const nameMatch = msg.content.match(/اسمي\s+(\w+)/u);
      if (nameMatch?.[1]) {
        await core.memory.remember('user:name', nameMatch[1]);
        console.log('[UserMemory] Saved user name:', nameMatch[1]);
      }
    });
  },
};

// ─── Plugin 3: Typing Indicator Broadcaster ───────────────────────────────────
// Example of a UI-affecting plugin. Future plugins can push UI state via events.

export const TypingBroadcastPlugin: Plugin = {
  id: 'typing-broadcast',
  name: 'Typing Broadcast',
  version: '1.0.0',
  description: 'Broadcasts typing events for reactive UI',

  install(core: CoreAPI) {
    core.events.on('message:sent', () => {
      core.events.emit('ui:typing:start');
    });

    core.events.on('message:received', () => {
      core.events.emit('ui:typing:stop');
    });

    core.events.on('message:error', () => {
      core.events.emit('ui:typing:stop');
    });
  },
};

// ─── Future Plugin Templates ──────────────────────────────────────────────────
// Uncomment and implement these as you grow:

/*
export const WeatherPlugin: Plugin = {
  id: 'weather',
  name: 'Weather Tool',
  version: '1.0.0',
  description: 'Lets Abika check the weather',
  install(core) {
    // Register a tool the AI can use
    // Hook into message:sent, detect weather intent, call weather API
    // Inject result into conversation
  }
}

export const ReminderPlugin: Plugin = {
  id: 'reminders',
  name: 'Reminder System',
  version: '1.0.0',
  description: 'Sets and fires reminders',
  install(core) { ... }
}

export const VoicePlugin: Plugin = {
  id: 'voice',
  name: 'Voice Input',
  version: '1.0.0',
  description: 'Adds speech-to-text input',
  install(core) { ... }
}
*/
