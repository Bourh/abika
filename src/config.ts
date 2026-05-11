/**
 * ABIKA CONFIGURATION
 * ────────────────────
 * Edit this file to configure the app.
 * Never hardcode these values elsewhere.
 *
 * ⚠️  Replace YOUR_API_KEY with your actual Anthropic API key.
 *     In production, load this from a secure env or keychain.
 */

import { AIConfig } from './core/types';

export const AI_CONFIG: AIConfig = {
  // ─── Model ────────────────────────────────────────────────────────────────
  model: 'claude-sonnet-4-20250514',
  maxTokens: 1024,
  temperature: 0.7,

  // ─── API Key ──────────────────────────────────────────────────────────────
  // TODO: Replace with your key. Use expo-constants or a secure store in prod.
  apiKey: 'YOUR_API_KEY_HERE',

  // ─── System Prompt ────────────────────────────────────────────────────────
  systemPrompt: `أنت أبيكا — مساعد ذكي وودود ومتعدد الإمكانيات.
  
تتحدث بالعربية الدارجة المغربية بشكل طبيعي، وتستجيب بنفس لغة المستخدم.
أنت نظام قابل للتوسع — مودولار بطبيعتك.
كن مختصراً، واضحاً، وذكياً.
إذا لم تعرف شيئاً، قل ذلك بصدق.`,
};

// ─── App Metadata ─────────────────────────────────────────────────────────────

export const APP_META = {
  name: 'Abika',
  nameAr: 'أبيكا',
  version: '1.0.0',
  tagline: 'نواتك الذكية',
};
