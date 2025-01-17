"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "./Modal";

interface EmailSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail: string;
  onSave: (settings: EmailSettings) => Promise<void>;
}

interface EmailSettings {
  email: string;
  marketingEmails: boolean;
  alertEmails: boolean;
}

export default function EmailSettingsModal({
  isOpen,
  onClose,
  initialEmail,
  onSave
}: EmailSettingsModalProps) {
  const [settings, setSettings] = useState<EmailSettings>({
    email: initialEmail,
    marketingEmails: true,
    alertEmails: true
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings({
        email: initialEmail,
        marketingEmails: true,
        alertEmails: true
      });
      setError(null);
      setSuccess(false);
      setIsDirty(false);
    }
  }, [isOpen, initialEmail]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(settings.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await onSave(settings);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof EmailSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Email Settings"
      maxWidth="md"
    >
      <div className="p-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-destructive/10 border-l-4 border-destructive rounded"
            >
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-green-500/10 border-l-4 border-green-500 rounded"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <p className="text-sm text-green-600">Settings saved successfully!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div>
            <label 
              htmlFor="email-input"
              className="block text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="email-input"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={initialEmail}
                className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "email-error" : undefined}
              />
            </div>
            {error && (
              <p id="email-error" className="mt-1 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2">
              Email Preferences
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) => handleChange("marketingEmails", e.target.checked)}
                  className="w-4 h-4 rounded border-input bg-background"
                />
                <span className="text-sm">Receive marketing emails</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.alertEmails}
                  onChange={(e) => handleChange("alertEmails", e.target.checked)}
                  className="w-4 h-4 rounded border-input bg-background"
                />
                <span className="text-sm">Receive alert emails</span>
              </label>
            </div>
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
          onClick={handleSubmit}
          disabled={!isDirty || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
