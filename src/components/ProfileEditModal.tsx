"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";

interface ValidationError {
  field: 'name' | 'image' | 'twitter' | 'calaxy';
  message: string;
}

interface ProfileData {
  name: string;
  image: string;
  twitter: string;
  calaxy: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileData;
  onSave: (data: ProfileData) => Promise<void>;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData.image);

  const validateForm = (): ValidationError | null => {
    if (!formData.name.trim()) {
      return { field: 'name', message: "Name is required" };
    }
    if (formData.name.length > 50) {
      return { field: 'name', message: "Name must be less than 50 characters" };
    }
    if (formData.twitter && !formData.twitter.match(/^@?[a-zA-Z0-9_]{1,15}$/)) {
      return { field: 'twitter', message: "Invalid Twitter username format" };
    }
    if (formData.calaxy && !formData.calaxy.match(/^[a-zA-Z0-9_-]{3,30}$/)) {
      return { field: 'calaxy', message: "Invalid Calaxy username format (3-30 characters, letters, numbers, - and _)" };
    }
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError({ field: 'image', message: "Please upload an image file" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError({ field: 'image', message: "Image must be less than 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError({ field: 'name', message: "Failed to save changes. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      maxWidth="lg"
    >
      <div className="p-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-destructive/10 border-l-4 border-destructive rounded text-sm text-destructive"
            >
              {error.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-border"
              />
              <label
                htmlFor="profile-image"
                className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a new profile picture (max 5MB)
            </p>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your name"
              maxLength={50}
            />
          </div>

          {/* Twitter Input */}
          <div>
            <label htmlFor="twitter" className="block text-sm font-medium mb-2">
              Twitter Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                @
              </span>
              <input
                type="text"
                id="twitter"
                value={formData.twitter.replace('@', '')}
                onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                className="w-full pl-8 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="username"
              />
            </div>
          </div>

          {/* Calaxy Input */}
          <div>
            <label htmlFor="calaxy" className="block text-sm font-medium mb-2">
              Calaxy Account
            </label>
            <input
              type="text"
              id="calaxy"
              value={formData.calaxy}
              onChange={e => setFormData(prev => ({ ...prev, calaxy: e.target.value }))}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your Calaxy username or ID"
            />
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
          disabled={isLoading}
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
