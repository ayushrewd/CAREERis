"use client";

import { useEffect, useState } from "react";

export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// Global singleton to capture beforeinstallprompt even before component mounts
let deferredPrompt: InstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: InstallPromptEvent | null) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as InstallPromptEvent;
    promptListeners.forEach((listener) => listener(deferredPrompt));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    promptListeners.forEach((listener) => listener(null));
  });
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(deferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [isLinux, setIsLinux] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in navigator && Boolean((navigator as any).standalone));
      setIsInstalled(standalone);
    };

    checkStandalone();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener?.("change", checkStandalone);

    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsAndroid(/android/.test(ua));
    setIsMac(/macintosh|mac os x/.test(ua) && !/iphone|ipad|ipod/.test(ua));
    setIsWindows(/windows/.test(ua));
    setIsLinux(/linux/.test(ua) && !/android/.test(ua));

    const listener = (prompt: InstallPromptEvent | null) => {
      setInstallPrompt(prompt);
    };
    promptListeners.add(listener);
    setInstallPrompt(deferredPrompt);

    return () => {
      promptListeners.delete(listener);
      mediaQuery.removeEventListener?.("change", checkStandalone);
    };
  }, []);

  const triggerInstall = async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!installPrompt) return "unavailable";
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        deferredPrompt = null;
        setInstallPrompt(null);
      }
      return choice.outcome;
    } catch {
      return "unavailable";
    }
  };

  return {
    isInstallable: Boolean(installPrompt),
    isInstalled,
    installPrompt,
    triggerInstall,
    isIOS,
    isAndroid,
    isMac,
    isWindows,
    isLinux,
  };
}
