/**
 * ABIKA EVENT BUS
 * ────────────────
 * The nervous system. Modules talk to each other WITHOUT knowing about each other.
 * Zero coupling. Complete isolation. Infinite extensibility.
 *
 * Usage:
 *   bus.on('message:sent', ({ content }) => doSomething(content))
 *   bus.emit('message:sent', { content: 'Hello' })
 */

import { IEventBus, EventHandler } from './types';

export class EventBus implements IEventBus {
  private listeners = new Map<string, Set<EventHandler<unknown>>>();

  on<T = unknown>(event: string, handler: EventHandler<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as EventHandler<unknown>);
  }

  off<T = unknown>(event: string, handler: EventHandler<T>): void {
    this.listeners.get(event)?.delete(handler as EventHandler<unknown>);
  }

  emit<T = unknown>(event: string, payload?: T): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`[EventBus] Handler error on "${event}":`, err);
      }
    });
  }

  once<T = unknown>(event: string, handler: EventHandler<T>): void {
    const wrapper: EventHandler<unknown> = (payload) => {
      handler(payload as T);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  /** Debug: list all registered events */
  inspect(): Record<string, number> {
    const result: Record<string, number> = {};
    this.listeners.forEach((handlers, event) => {
      result[event] = handlers.size;
    });
    return result;
  }
}
