"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Wallet, ArrowLeftRight, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    name: "Wallets",
    href: "/wallets",
    icon: Wallet
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings
  }
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-sidebar p-4">
      <div className="mb-8 px-4 py-2">
        <h1 className="text-xl font-semibold text-sidebar-foreground">Hedera Tracker</h1>
      </div>
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative block"
            >
              <div className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors
                ${isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-sidebar-accent"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <item.icon className="h-4 w-4" />
                <span className="relative">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
