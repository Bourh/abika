/**
 * ABIKA — Entry Point
 * ────────────────────
 * Boot sequence:
 *   1. AbikaProvider creates the core
 *   2. Core boots and installs startup plugins
 *   3. ChatScreen renders
 *
 * To add a plugin at startup, add it to the `plugins` array in AbikaBootConfig.
 */

import React from 'react';
import { AbikaProvider } from './src/context/AbikaContext';
import { ChatScreen } from './src/screens/ChatScreen';
import { AI_CONFIG } from './src/config';
import { LoggerPlugin, UserMemoryPlugin } from './src/modules/examplePlugins';

export default function App() {
  return (
    <AbikaProvider
      config={{
        ai: AI_CONFIG,
        plugins: [
          LoggerPlugin,
          UserMemoryPlugin,
          // Add more plugins here as you grow
        ],
      }}
    >
      <ChatScreen />
    </AbikaProvider>
  );
}
