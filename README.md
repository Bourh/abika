# أبيكا — النواة الذكية المعيارية

```
┌─────────────────────────────────────────┐
│           ABIKA CORE v1.0               │
│   نظام ذكاء اصطناعي مودولار           │
│   قابل للتوسع بدون لمس النواة          │
└─────────────────────────────────────────┘
```

## البنية المعمارية

```
abika/
├── App.tsx                    ← نقطة الدخول
├── src/
│   ├── config.ts              ← الإعدادات (API key، system prompt)
│   ├── theme.ts               ← الألوان والتصميم
│   │
│   ├── core/                  ← ⭐ النواة (لا تمسها)
│   │   ├── types.ts           ← العقود والواجهات
│   │   ├── EventBus.ts        ← الجهاز العصبي
│   │   ├── MemoryStore.ts     ← الذاكرة (قصيرة + طويلة)
│   │   ├── AIEngine.ts        ← الاتصال بـ Claude API
│   │   ├── PluginLoader.ts    ← نظام التوسع
│   │   └── AbikaCore.ts       ← المنسق الرئيسي
│   │
│   ├── context/
│   │   └── AbikaContext.tsx   ← React Context للـ core
│   │
│   ├── hooks/
│   │   └── useChat.ts         ← منطق المحادثة
│   │
│   ├── screens/
│   │   └── ChatScreen.tsx     ← واجهة الدردشة
│   │
│   ├── components/
│   │   ├── MessageBubble.tsx  ← فقاعة الرسالة
│   │   └── ChatInput.tsx      ← حقل الإدخال
│   │
│   └── modules/
│       └── examplePlugins.ts  ← أمثلة على البلاقن
```

## الطبقات

```
┌─────────────────────────────────┐
│           UI Layer              │  ← screens + components
├─────────────────────────────────┤
│         Hooks Layer             │  ← useChat (المنطق)
├─────────────────────────────────┤
│       Context Layer             │  ← AbikaProvider
├─────────────────────────────────┤
│        CORE NUCLEUS             │  ← EventBus + Memory + AI + Plugins
└─────────────────────────────────┘
```

## الإعداد

### 1. تثبيت المشروع
```bash
cd abika
npm install
```

### 2. إضافة API Key
في ملف `src/config.ts`:
```typescript
apiKey: 'sk-ant-...',  // مفتاح Anthropic الخاص بك
```

### 3. تشغيل التطبيق
```bash
npx expo start
```

## إضافة بلاقن جديد

```typescript
// src/modules/myPlugin.ts
import { Plugin } from '../core/types';

export const MyPlugin: Plugin = {
  id: 'my-plugin',
  name: 'My Feature',
  version: '1.0.0',
  description: 'What this plugin does',

  install(core) {
    // لديك وصول كامل للنواة:
    core.events.on('message:sent', (msg) => { /* ... */ });
    core.memory.remember('key', 'value');
    core.ai.updateConfig({ systemPrompt: '...' });
  },

  uninstall() {
    // تنظيف عند الإزالة
  }
};
```

```typescript
// App.tsx — أضف البلاقن هنا
import { MyPlugin } from './src/modules/myPlugin';

<AbikaProvider config={{ ai: AI_CONFIG, plugins: [MyPlugin] }}>
```

## الأحداث المتوفرة

| الحدث | متى يُطلق |
|-------|-----------|
| `core:ready` | عند اكتمال البوت |
| `message:sent` | عند إرسال رسالة |
| `message:received` | عند وصول رد الـ AI |
| `message:error` | عند حدوث خطأ |
| `plugin:installed` | عند تثبيت بلاقن |
| `plugin:uninstalled` | عند إزالة بلاقن |

## إضافات مستقبلية (بلاقن)

كل هذه تُضاف بدون لمس النواة:

- 🌦 **WeatherPlugin** — جلب الطقس
- ⏰ **ReminderPlugin** — تذكيرات
- 🎙 **VoicePlugin** — إدخال صوتي
- 🔍 **WebSearchPlugin** — بحث ويب
- 📅 **CalendarPlugin** — إدارة التقويم
- 🤖 **ToolUsePlugin** — function calling
- 💾 **SyncPlugin** — مزامنة السحابة
- 🌐 **MultiLanguagePlugin** — تعدد اللغات

## المبادئ

1. **النواة لا تتغير** — كل شيء يُضاف كبلاقن
2. **الأحداث تربط كل شيء** — لا coupling بين الوحدات
3. **الذاكرة طبقتان** — قصيرة (RAM) + طويلة (AsyncStorage)
4. **TypeScript صارم** — الأنواع تحمي البنية
5. **UI غبية** — كل المنطق في الـ hooks والـ core

---

*بني بنية تحمل الفكرة، وكل شيء تاني ييجي من ذاتو.*
