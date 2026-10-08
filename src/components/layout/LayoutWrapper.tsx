'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false); // default Demo Mode for hackathon reviewer
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('Au6y8RRdGUFMm4jKVbguCVcwUbiGtyz9VCPLSF388Cka');

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090c] text-[#f1f3f9] selection:bg-[#ff5c16]/30 selection:text-white">
      <Header
        isLiveMode={isLiveMode}
        setIsLiveMode={setIsLiveMode}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
        walletAddress={walletAddress}
      />

      <main className="flex-1 w-full">{children}</main>

      <Footer />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleLiveMode={() => setIsLiveMode((prev) => !prev)}
        isLiveMode={isLiveMode}
      />
    </div>
  );
};
