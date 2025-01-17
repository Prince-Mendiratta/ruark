"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, ChevronDown, Globe2, Moon, Percent, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "./Modal";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

interface NotificationThreshold {
  value: number;
  enabled: boolean;
}

export default function PreferencesModal({
  isOpen,
  onClose,
  theme,
  onThemeChange
}: PreferencesModalProps) {
  const [language, setLanguage] = useState("en");
  const [customThreshold, setCustomThreshold] = useState<number>(15);
  const [thresholds, setThresholds] = useState<Record<string, NotificationThreshold>>({
    "5": { value: 5, enabled: false },
    "10": { value: 10, enabled: true },
    "20": { value: 20, enabled: false },
    "custom": { value: customThreshold, enabled: false }
  });

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const data = JSON.parse(savedPreferences);
        if (data && typeof data === 'object') {
          if ('thresholds' in data && typeof data.thresholds === 'object') {
            // Validate the thresholds structure
            const savedThresholds = Object.entries(data.thresholds).reduce((acc, [key, value]) => {
              if (typeof value === 'object' && value !== null && 
                  'value' in value && typeof value.value === 'number' &&
                  'enabled' in value && typeof value.enabled === 'boolean') {
                acc[key] = value as NotificationThreshold;
              }
              return acc;
            }, {} as Record<string, NotificationThreshold>);
            
            setThresholds(savedThresholds);
          }
          
          if ('customThreshold' in data && typeof data.customThreshold === 'number') {
            setCustomThreshold(data.customThreshold);
          }
        }
      } catch (error) {
        console.error('Failed to parse preferences:', error);
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify({
      thresholds,
      customThreshold
    }));
  };

  const handleThresholdToggle = (key: string) => {
    setThresholds(prev => {
      const threshold = prev[key];
      if (!threshold) return prev;
      
      return {
        ...prev,
        [key]: {
          ...threshold,
          enabled: !threshold.enabled
        }
      };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Preferences"
      maxWidth="md"
    >
      <div className="p-6 space-y-8">
        {/* Language Selection */}
        <div>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            Language
          </h3>
          <div className="relative opacity-50">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled
              className="w-full appearance-none bg-background border rounded-lg px-4 py-2 pr-10"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <p className="mt-2 text-sm text-muted-foreground">
              Additional languages coming soon
            </p>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            {theme === "light" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            Appearance
          </h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                checked={theme === "light"}
                onChange={() => onThemeChange("light")}
                className="sr-only"
              />
              <div className={`p-3 border rounded-lg transition-colors ${
                theme === "light" ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
              }`}>
                <Sun className="w-5 h-5" />
              </div>
              <span>Light</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                checked={theme === "dark"}
                onChange={() => onThemeChange("dark")}
                className="sr-only"
              />
              <div className={`p-3 border rounded-lg transition-colors ${
                theme === "dark" ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
              }`}>
                <Moon className="w-5 h-5" />
              </div>
              <span>Dark</span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Price Alert Thresholds
          </h3>
          <div className="space-y-4">
            {Object.entries(thresholds).map(([key, threshold]) => (
              key === "custom" ? (
                <div key={key} className="flex items-center gap-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={threshold.enabled}
                      onChange={() => handleThresholdToggle(key)}
                      className="w-4 h-4 rounded border-input bg-background"
                    />
                    <span>Custom</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customThreshold}
                      onChange={(e) => setCustomThreshold(Number(e.target.value))}
                      min="1"
                      max="100"
                      disabled={!threshold.enabled}
                      className="w-24 pl-3 pr-8 py-1 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                    <Percent className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <label key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={threshold.enabled}
                    onChange={() => handleThresholdToggle(key)}
                    className="w-4 h-4 rounded border-input bg-background"
                  />
                  <span>{threshold.value}% change</span>
                </label>
              )
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 p-4 border-t bg-muted/50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            savePreferences();
            onClose();
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </Modal>
  );
}
