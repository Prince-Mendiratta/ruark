"use client";

import { motion } from "framer-motion";
import { Activity, AlertCircle, Plus, Trash2, UserCog, Wallet } from "lucide-react";
import { format } from "date-fns";
import Modal from "./Modal";

interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  type: "wallet_add" | "wallet_remove" | "account_update" | "security_update" | "other";
  description: string;
  walletAddress?: string;
}

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample activity data
const sampleActivities: ActivityLogEntry[] = [
  {
    id: "1",
    timestamp: new Date(2024, 0, 15, 14, 30),
    type: "wallet_add",
    description: "Added new wallet to account",
    walletAddress: "0.0.847264"
  },
  {
    id: "2",
    timestamp: new Date(2024, 0, 15, 12, 15),
    type: "account_update",
    description: "Updated profile information"
  },
  {
    id: "3",
    timestamp: new Date(2024, 0, 14, 16, 45),
    type: "wallet_remove",
    description: "Removed wallet from account",
    walletAddress: "0.0.123456"
  },
  {
    id: "4",
    timestamp: new Date(2024, 0, 14, 10, 20),
    type: "security_update",
    description: "Changed account password"
  },
  {
    id: "5",
    timestamp: new Date(2024, 0, 13, 9, 30),
    type: "other",
    description: "Updated notification preferences"
  }
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

const getActivityIcon = (type: ActivityLogEntry["type"]) => {
  switch (type) {
    case "wallet_add":
      return <Plus className="w-4 h-4" />;
    case "wallet_remove":
      return <Trash2 className="w-4 h-4" />;
    case "account_update":
      return <UserCog className="w-4 h-4" />;
    case "security_update":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getActivityColor = (type: ActivityLogEntry["type"]) => {
  switch (type) {
    case "wallet_add":
      return "bg-green-500/10 text-green-500";
    case "wallet_remove":
      return "bg-red-500/10 text-red-500";
    case "account_update":
      return "bg-blue-500/10 text-blue-500";
    case "security_update":
      return "bg-yellow-500/10 text-yellow-500";
    default:
      return "bg-primary/10 text-primary";
  }
};

export default function ActivityLogModal({ isOpen, onClose }: ActivityLogModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Activity Log"
      maxWidth="xl"
    >
      <div className="max-h-[600px] overflow-y-auto">
        <div className="divide-y">
          {sampleActivities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{activity.description}</p>
                  {activity.walletAddress && (
                    <div className="flex items-center gap-2 mt-1">
                      <Wallet className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-mono">
                        {activity.walletAddress}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-end p-4 border-t bg-muted/50">
        <button
          onClick={onClose}
          className="px-4 py-2 font-medium hover:bg-accent rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
