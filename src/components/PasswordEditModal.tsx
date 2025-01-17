"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "./Modal";

interface PasswordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwords: PasswordData) => Promise<void>;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const validatePassword = (password: string): PasswordStrength => {
  let score = 0;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ];

  score = checks.filter(Boolean).length;

  const strengths: PasswordStrength[] = [
    { score: 0, label: "Very Weak", color: "bg-red-500" },
    { score: 1, label: "Weak", color: "bg-orange-500" },
    { score: 2, label: "Fair", color: "bg-yellow-500" },
    { score: 3, label: "Good", color: "bg-blue-500" },
    { score: 4, label: "Strong", color: "bg-green-500" },
    { score: 5, label: "Very Strong", color: "bg-green-600" }
  ];

  // Ensure we always return a valid strength by clamping the score
  const clampedScore = Math.min(Math.max(score, 0), strengths.length - 1);
  // TypeScript needs a non-null assertion here since we know the index is valid
  return strengths[clampedScore]!;
};

export default function PasswordEditModal({
  isOpen,
  onClose,
  onSave
}: PasswordEditModalProps) {
  const [passwords, setPasswords] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = validatePassword(passwords.newPassword);

  useEffect(() => {
    if (isOpen) {
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setError(null);
      setSuccess(false);
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      });
    }
  }, [isOpen]);

  const validateForm = (): string | null => {
    if (!passwords.currentPassword) {
      return "Current password is required";
    }
    if (!passwords.newPassword) {
      return "New password is required";
    }
    if (passwords.newPassword.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(passwords.newPassword)) {
      return "Password must include at least one uppercase letter";
    }
    if (!/[a-z]/.test(passwords.newPassword)) {
      return "Password must include at least one lowercase letter";
    }
    if (!/[0-9]/.test(passwords.newPassword)) {
      return "Password must include at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(passwords.newPassword)) {
      return "Password must include at least one special character";
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await onSave(passwords);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      maxWidth="md"
    >
      <div className="p-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-destructive/5 border border-destructive/10 shadow-sm rounded-lg"
            >
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-green-500/5 border border-green-500/10 shadow-sm rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <p className="text-sm text-green-600">Password updated successfully!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwords.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow hover:border-primary/20"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwords.newPassword && (
              <div className="mt-2">
                <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className={`h-full ${passwordStrength.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Password Strength: {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 p-4 border-t bg-muted/50">
        <button
          onClick={onClose}
          className="px-4 py-2.5 text-sm font-medium hover:bg-accent/80 rounded-lg transition-all hover:shadow-sm active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword || isLoading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:hover:shadow-none disabled:active:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
