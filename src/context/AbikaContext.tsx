/**
 * ABIKA CORE CONTEXT
 * ───────────────────
 * Makes the core available to any component without prop-drilling.
 * 
 * Usage:
 *   const { core } = useAbika()
 *   const { events, memory, ai, plugins } = core.api
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AbikaCore, AbikaBootConfig } from '../core/AbikaCore';

interface AbikaContextValue {
  core: AbikaCore;
  isReady: boolean;
}

const AbikaContext = createContext<AbikaContextValue | null>(null);

interface AbikaProviderProps {
  config: AbikaBootConfig;
  children: ReactNode;
}

export function AbikaProvider({ config, children }: AbikaProviderProps) {
  const [core] = useState(() => AbikaCore.create(config));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    core.boot().then(() => setIsReady(true));
  }, [core]);

  return (
    <AbikaContext.Provider value={{ core, isReady }}>
      {children}
    </AbikaContext.Provider>
  );
}

export function useAbika(): AbikaContextValue {
  const ctx = useContext(AbikaContext);
  if (!ctx) {
    throw new Error('useAbika must be used inside <AbikaProvider>');
  }
  return ctx;
}
