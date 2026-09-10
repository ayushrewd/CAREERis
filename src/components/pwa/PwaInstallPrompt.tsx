"use client";

import { useEffect, useState } from "react";
import { Download, Share2, Sparkles, X, Info } from "lucide-react";
import { usePwaInstall } from "./usePwaInstall";
import { DownloadAppModal } from "./DownloadAppModal";

export function PwaInstallPrompt() {
  const { isInstallable, isInstalled, triggerInstall, isIOS } = usePwaInstall();
  const [dismissed, setDismissed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Never let a service worker cache development bundles on localhost.
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV !== "production") {
        navigator.serviceWorker.getRegistrations().then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        ).catch(() => undefined);
        if ("caches" in window) {
          caches.keys().then((keys) => Promise.all(
            keys.filter((key) => key.startsWith("careeris-app-")).map((key) => caches.delete(key))
          )).catch(() => undefined);
        }
        return;
      }
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error) => console.error("Service worker registration failed", error));
    }

    if (isInstalled || sessionStorage.getItem("careeris_install_dismissed") === "1") {
      return;
    }

    // Delay prompt appearance by 2.5s for non-intrusive presentation
    const timer = setTimeout(() => {
      setDismissed(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  async function handleInstall() {
    if (isInstallable) {
      const outcome = await triggerInstall();
      if (outcome === "accepted") {
        setDismissed(true);
        return;
      }
    }
    // If not direct or iOS, open the guide modal
    setIsModalOpen(true);
  }

  function dismiss() {
    sessionStorage.setItem("careeris_install_dismissed", "1");
    setDismissed(true);
  }

  if (dismissed || isInstalled) return null;

  return (
    <>
      <aside className="fixed inset-x-3 bottom-20 z-[70] mx-auto max-w-lg rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-2xl backdrop-blur-xl md:bottom-5 animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-sm font-bold text-foreground">
                Install CAREERIS App
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Universal PWA
              </span>
            </div>
            {isIOS ? (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                In Safari, tap <Share2 className="mx-1 inline h-3.5 w-3.5 text-primary" /> Share and choose{" "}
                <strong className="text-foreground">Add to Home Screen</strong>.
              </p>
            ) : (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Install CAREERIS on your computer or phone for instant launch and offline access.
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-95 transition-opacity"
              >
                <Download className="h-3.5 w-3.5" />
                {isInstallable ? "Install App" : "How to Install"}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-border/80 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <Info className="h-3.5 w-3.5" />
                <span>All Devices</span>
              </button>
            </div>
          </div>
          <button
            aria-label="Dismiss install prompt"
            onClick={dismiss}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <DownloadAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
