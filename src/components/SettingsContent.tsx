"use client";

import { motion } from "framer-motion";
import { 
  Bell, 
  ChevronRight, 
  Globe2, 
  Key, 
  Lock,
  Mail, 
  Moon,
  PanelRight,
  Shield, 
  Sun, 
  User,
  Wallet,
  LogOut
} from "lucide-react";
import { useState } from "react";
import SparkBorder from "./SparkBorder";
import ProfileEditModal from "./ProfileEditModal";
import EmailSettingsModal from "./EmailSettingsModal";
import PasswordEditModal from "./PasswordEditModal";

interface EmailSettings {
  email: string;
  marketingEmails: boolean;
  alertEmails: boolean;
}

export default function SettingsContent() {
  const [userData, setUserData] = useState({
    name: "Alex Thompson",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
    joinDate: "January 2024"
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const settingSections = [
    {
      title: "Account",
      icon: User,
      items: [
        { name: "Profile Information", description: "Update your personal details", icon: User },
        { name: "Email Settings", description: "Manage your email preferences", icon: Mail },
        { name: "Password Management", description: "Keep your account secure", icon: Lock }
      ]
    },
    {
      title: "Preferences",
      icon: PanelRight,
      items: [
        { name: "Appearance", description: "Customize your interface", icon: Moon },
        { name: "Language", description: "Choose your preferred language", icon: Globe2 },
        { name: "Notifications", description: "Manage your alerts", icon: Bell }
      ]
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { name: "Two-Factor Authentication", description: "Add an extra layer of security", icon: Key },
        { name: "Connected Wallets", description: "Manage your linked wallets", icon: Wallet },
        { name: "Activity Log", description: "Review your account activity", icon: ChevronRight }
      ]
    }
  ];

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
      </div>

      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-card border rounded-lg p-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-border"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium truncate">{userData.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground truncate">{userData.email}</p>
                <span className="inline-block w-1 h-1 rounded-full bg-border" />
                <p className="text-sm text-muted-foreground">Since {userData.joinDate}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* Theme Toggle */}
      <div className="mb-8">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
              <div>
                <h3 className="font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  {theme === "light" ? "Light mode" : "Dark mode"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors"
            >
              <span
                className={`${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-primary transition-transform`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6">
        {settingSections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-lg overflow-hidden"
          >
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">{section.title}</h2>
              </div>
            </div>
            <div className="divide-y">
              {section.items.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 4 }}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    if (item.name === "Profile Information") {
                      setIsProfileModalOpen(true);
                    } else if (item.name === "Email Settings") {
                      setIsEmailModalOpen(true);
                    } else if (item.name === "Password & Security") {
                      setIsPasswordModalOpen(true);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialData={{
          name: userData.name,
          image: userData.avatar,
          twitter: "",
          calaxy: ""
        }}
        onSave={async (data) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setUserData(prev => ({
            ...prev,
            name: data.name,
            avatar: data.image
          }));
        }}
      />

      <PasswordEditModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={async (passwords) => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Updating password:', passwords);
        }}
      />

      <EmailSettingsModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        initialEmail={userData.email}
        onSave={async (settings: EmailSettings) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setUserData(prev => ({
            ...prev,
            email: settings.email
          }));
        }}
      />
    </div>
  );
}
