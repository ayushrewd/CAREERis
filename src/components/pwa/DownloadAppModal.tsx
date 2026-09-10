"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Laptop,
  Apple,
  ShieldCheck,
  Zap,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import { usePwaInstall } from "./usePwaInstall";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlatformTab = "auto" | "ios" | "android" | "windows" | "mac" | "linux";

export function DownloadAppModal({ isOpen, onClose }: DownloadAppModalProps) {
  const {
    isInstallable,
    isInstalled,
    triggerInstall,
    isIOS,
    isAndroid,
    isMac,
    isWindows,
    isLinux,
  } = usePwaInstall();

  // Determine user's current detected OS for default tab
  const detectedPlatform: PlatformTab = isIOS
    ? "ios"
    : isAndroid
    ? "android"
    : isWindows
    ? "windows"
    : isMac
    ? "mac"
    : isLinux
    ? "linux"
    : "windows";

  const [activeTab, setActiveTab] = useState<PlatformTab>(detectedPlatform);
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(detectedPlatform);
      setInstallSuccess(false);
    }
  }, [isOpen, detectedPlatform]);

  // Keyboard shortcut listener (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setInstalling(true);
    const result = await triggerInstall();
    setInstalling(false);
    if (result === "accepted") {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all">
        {/* Glowing Background Accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-primary/40 shadow-lg shadow-primary/20">
            <Image
              src="/icons/icon-192.png"
              alt="CAREERIS App Icon"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Download CAREERIS App
              </h2>
              <Badge variant="secondary" className="border-primary/30 text-primary text-[11px] font-semibold">
                Universal App
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Install the official national platform on your device for instant access, native notifications, and offline capability.
            </p>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="mt-6 flex flex-wrap gap-1.5 rounded-xl border bg-muted/40 p-1 text-xs">
          {[
            { id: "ios", label: "iPhone / iPad", icon: Apple },
            { id: "android", label: "Android", icon: Smartphone },
            { id: "mac", label: "MacBook (macOS)", icon: Apple },
            { id: "windows", label: "Windows PC", icon: Laptop },
            { id: "linux", label: "Linux", icon: Laptop },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            const isDetected = detectedPlatform === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PlatformTab)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-medium transition-all ${
                  isCurrent
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
                {isDetected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" title="Your device" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content / Device Specific Guide */}
        <div className="mt-5 rounded-2xl border bg-card/60 p-5 backdrop-blur-sm">
          {/* Direct 1-Click Install Button (When Browser Supports beforeinstallprompt) */}
          {isInstallable && !isInstalled && (
            <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
              <p className="text-xs font-semibold text-primary">
                ⚡ 1-Click Installation Available on This Browser
              </p>
              <Button
                onClick={handleInstallClick}
                disabled={installing}
                className="mt-2.5 w-full sm:w-auto px-6 font-bold shadow-md shadow-primary/20"
              >
                <Download className="mr-2 h-4 w-4" />
                {installing ? "Installing CAREERIS..." : "Install Now (1-Click)"}
              </Button>
            </div>
          )}

          {isInstalled && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              CAREERIS is already installed as a native app on this device!
            </div>
          )}

          {installSuccess && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Application successfully installed! You can now launch it from your apps.
            </div>
          )}

          {/* iOS / iPadOS Instructions */}
          {activeTab === "ios" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Apple className="h-4 w-4 text-primary" />
                Installing on iPhone & iPad (Safari & Chrome)
              </div>
              <ol className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    1
                  </span>
                  <span>
                    Open this website in <strong>Safari</strong> (or Chrome on iOS).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    2
                  </span>
                  <span>
                    Tap the <strong>Share button</strong>{" "}
                    <Share2 className="inline h-3.5 w-3.5 mx-0.5 text-primary" /> located at the bottom
                    navigation bar (or top toolbar on iPad).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    3
                  </span>
                  <span>
                    Scroll down and select{" "}
                    <strong className="text-foreground">
                      <PlusSquare className="inline h-3.5 w-3.5 mx-0.5 text-primary" /> Add to Home Screen
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    4
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top-right corner. The CAREERIS icon will now appear on
                    your home screen and launch in full-screen standalone mode!
                  </span>
                </li>
              </ol>
            </div>
          )}

          {/* Android Instructions */}
          {activeTab === "android" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Smartphone className="h-4 w-4 text-primary" />
                Installing on Android (Chrome, Edge, Samsung Internet)
              </div>
              <ol className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    1
                  </span>
                  <span>
                    In Chrome, Edge, or Samsung Internet, tap the <strong>three-dots menu (⋮)</strong> in
                    the top-right corner.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    2
                  </span>
                  <span>
                    Tap <strong className="text-foreground">Install App</strong> or{" "}
                    <strong className="text-foreground">Add to Home screen</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    3
                  </span>
                  <span>
                    Confirm <strong>Install</strong>. CAREERIS will install into your App Drawer like a
                    native Android application with offline caching and badge notifications.
                  </span>
                </li>
              </ol>
            </div>
          )}

          {/* Windows PC Instructions */}
          {activeTab === "windows" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Laptop className="h-4 w-4 text-primary" />
                Installing on Windows 10 / 11 (Chrome, Edge, Brave)
              </div>
              <ol className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    1
                  </span>
                  <span>
                    Look at the right side of the browser address bar (URL bar) for the{" "}
                    <strong>Install App icon (⊕ or computer icon)</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    2
                  </span>
                  <span>
                    Click it, or click the browser menu (⋮ / ⋯) → <strong>Apps</strong> →{" "}
                    <strong className="text-foreground">Install CAREERIS</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    3
                  </span>
                  <span>
                    CAREERIS will pin to your <strong>Windows Start Menu</strong> and <strong>Taskbar</strong>,
                    opening in its own dedicated, borderless app window!
                  </span>
                </li>
              </ol>
            </div>
          )}

          {/* MacBook (macOS) Instructions */}
          {activeTab === "mac" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Apple className="h-4 w-4 text-primary" />
                Installing on macOS (Safari, Chrome, Edge)
              </div>
              <ol className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    1
                  </span>
                  <span>
                    <strong>In Safari (macOS Sonoma or newer):</strong> Click <strong>File</strong> in the top
                    menu bar → select <strong className="text-foreground">Add to Dock...</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    2
                  </span>
                  <span>
                    <strong>In Chrome / Edge:</strong> Click the install icon (⊕) in the address bar or menu →{" "}
                    <strong className="text-foreground">Install CAREERIS</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    3
                  </span>
                  <span>
                    The app will be placed into your <strong>macOS Applications folder</strong> and Dock,
                    accessible via Spotlight (Cmd + Space).
                  </span>
                </li>
              </ol>
            </div>
          )}

          {/* Linux Instructions */}
          {activeTab === "linux" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Laptop className="h-4 w-4 text-primary" />
                Installing on Linux (Ubuntu, Debian, Fedora, Arch)
              </div>
              <ol className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    1
                  </span>
                  <span>
                    In Chromium, Chrome, or Edge, click the <strong>Install App icon (⊕)</strong> in the URL
                    bar.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    2
                  </span>
                  <span>
                    Click <strong className="text-foreground">Install</strong>. A desktop launcher (`.desktop`
                    file) will automatically be created in your desktop environment (GNOME, KDE, XFCE).
                  </span>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Native App Benefits Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-xl border bg-muted/20 p-3">
            <Zap className="mx-auto h-4 w-4 text-amber-500" />
            <p className="mt-1.5 text-xs font-bold">Instant Launch</p>
            <p className="text-[10px] text-muted-foreground">No browser clutter</p>
          </div>
          <div className="rounded-xl border bg-muted/20 p-3">
            <HardDrive className="mx-auto h-4 w-4 text-blue-500" />
            <p className="mt-1.5 text-xs font-bold">&lt; 2 MB Storage</p>
            <p className="text-[10px] text-muted-foreground">Zero bloatware</p>
          </div>
          <div className="rounded-xl border bg-muted/20 p-3">
            <Sparkles className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1.5 text-xs font-bold">Auto Updating</p>
            <p className="text-[10px] text-muted-foreground">Always latest version</p>
          </div>
          <div className="rounded-xl border bg-muted/20 p-3">
            <ShieldCheck className="mx-auto h-4 w-4 text-emerald-500" />
            <p className="mt-1.5 text-xs font-bold">Safe &amp; Sandboxed</p>
            <p className="text-[10px] text-muted-foreground">Encrypted offline storage</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t pt-4">
          <p className="text-[11px] text-muted-foreground">
            Compatible with iOS 16.4+, Android 8+, macOS 14+, Windows 10/11 &amp; Linux.
          </p>
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Got it, Close
          </Button>
        </div>
      </div>
    </div>
  );
}
