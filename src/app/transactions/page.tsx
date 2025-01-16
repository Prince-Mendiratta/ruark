"use client";

import { motion } from "framer-motion";
import { useWalletStore } from "@/lib/store/walletStore";
import { ArrowDownToLine, ArrowUpFromLine, Calendar, Download, ExternalLink, Search, Wallet } from "lucide-react";
import { useState } from "react";
import SparkBorder from "@/components/SparkBorder";

// Sample transaction data
const transactions = [
  {
    id: "tx-001",
    type: "send",
    amount: "150.00",
    token: "HBAR",
    to: "0.0.847264",
    from: "0.0.123456",
    timestamp: "2024-01-15T14:30:00Z",
    status: "success",
    memo: "Payment for services",
  },
  {
    id: "tx-002", 
    type: "receive",
    amount: "500.00",
    token: "HBAR",
    to: "0.0.123456",
    from: "0.0.956732",
    timestamp: "2024-01-14T09:15:00Z",
    status: "success",
    memo: "Monthly revenue",
  },
  {
    id: "tx-003",
    type: "send",
    amount: "75.50",
    token: "HBAR",
    to: "0.0.384756",
    from: "0.0.123456",
    timestamp: "2024-01-13T18:45:00Z",
    status: "success",
    memo: "Subscription renewal",
  },
  // Add more sample transactions as needed
];

export default function TransactionsPage() {
  const { wallets } = useWalletStore();
  const activeWallet = wallets.find(w => w.isActive);
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter(tx => 
    tx.memo.toLowerCase().includes(search.toLowerCase()) ||
    tx.to.toLowerCase().includes(search.toLowerCase()) ||
    tx.from.toLowerCase().includes(search.toLowerCase())
  );

  const downloadTransactions = () => {
    const csv = [
      ["Transaction ID", "Type", "Amount", "Token", "To", "From", "Date", "Status", "Memo"],
      ...filteredTransactions.map(tx => [
        tx.id,
        tx.type,
        tx.amount,
        tx.token,
        tx.to,
        tx.from,
        new Date(tx.timestamp).toLocaleString(),
        tx.status,
        tx.memo
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-muted-foreground mt-1">View and manage your transaction history</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadTransactions}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </motion.button>
      </div>

      {/* Active Wallet Card */}
      {activeWallet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SparkBorder>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-1">Active Wallet</h2>
                  <p className="font-mono text-muted-foreground">{activeWallet.address}</p>
                </div>
              </div>
            </div>
          </SparkBorder>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">To</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">From</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Memo</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b last:border-none hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {tx.type === "send" ? (
                        <div className="p-1.5 bg-red-500/10 rounded-full">
                          <ArrowUpFromLine className="w-4 h-4 text-red-500" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-green-500/10 rounded-full">
                          <ArrowDownToLine className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={tx.type === "send" ? "text-red-500" : "text-green-500"}>
                      {tx.type === "send" ? "-" : "+"}{tx.amount} {tx.token}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm">{tx.to}</td>
                  <td className="py-4 px-4 font-mono text-sm">{tx.from}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{tx.memo}</td>
                  <td className="py-4 px-4 text-right">
                    <motion.a
                      href={`https://hashscan.io/mainnet/transaction/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-accent transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View</span>
                    </motion.a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
