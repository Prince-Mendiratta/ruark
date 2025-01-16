"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Copy, Plus, Wallet } from "lucide-react";
import { format } from "date-fns";
import { useWalletStore } from "@/lib/store/walletStore";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function WalletsPage() {
  const [newWallet, setNewWallet] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "activate" | "deactivate";
    address: string;
  }>({
    isOpen: false,
    type: "activate",
    address: "",
  });

  const { wallets, addWallet, activateWallet, deactivateWallet } = useWalletStore();
  const activeWallet = wallets.find(w => w.isActive);

  const validateAddress = (address: string) => {
    // Basic Hedera address validation - should be enhanced based on requirements
    return /^0\.0\.[0-9]+$/.test(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateAddress(newWallet)) {
      setError("Please enter a valid Hedera account ID (e.g., 0.0.123456)");
      return;
    }

    if (wallets.some(w => w.address === newWallet)) {
      setError("This wallet is already connected");
      return;
    }

    addWallet(newWallet);
    setNewWallet("");
    setSuccess("Wallet connected successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">

      {/* Add New Wallet Form */}
      <div className="bg-card p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-semibold mb-6">Connect New Wallet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="wallet-address" className="block text-sm font-medium mb-2">
              Wallet Address
            </label>
            <div className="flex gap-4">
              <input
                id="wallet-address"
                type="text"
                value={newWallet}
                onChange={(e) => setNewWallet(e.target.value)}
                placeholder="0.0.123456"
                className="flex-1 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Connect</span>
              </button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-destructive text-sm"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-green-500 text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {success}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Active Wallet Banner */}
      {activeWallet && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-6 rounded-lg border mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Active Wallet</h2>
              <p className="font-mono text-muted-foreground">{activeWallet.address}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Wallets Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Wallets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Wallet Address</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Date Added</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet) => (
                <tr
                  key={wallet.address}
                  className={`border-b last:border-none hover:bg-muted/50 transition-colors ${
                    wallet.isActive ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="py-4 px-6 font-mono">{wallet.address}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm ${
                        wallet.isActive
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        wallet.isActive ? "bg-green-500" : "bg-muted-foreground"
                      }`} />
                      {wallet.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {format(new Date(wallet.dateAdded), "MMM d, yyyy")}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {wallet.isActive ? (
                      <button
                        onClick={() => setDialogState({
                          isOpen: true,
                          type: "deactivate",
                          address: wallet.address
                        })}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-accent transition-colors"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => setDialogState({
                          isOpen: true,
                          type: "activate",
                          address: wallet.address
                        })}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Activate
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {wallets.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No wallets connected yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState(s => ({ ...s, isOpen: false }))}
        onConfirm={() => {
          if (dialogState.type === "activate") {
            activateWallet(dialogState.address);
          } else {
            deactivateWallet(dialogState.address);
          }
        }}
        title={dialogState.type === "activate" ? "Activate Wallet" : "Deactivate Wallet"}
        message={dialogState.type === "activate"
          ? "Are you sure you want to activate this wallet? This will deactivate your currently active wallet."
          : "Are you sure you want to deactivate this wallet?"
        }
        confirmText={dialogState.type === "activate" ? "Activate" : "Deactivate"}
      />
    </div>
  );
}
