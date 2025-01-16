"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Wallet, ArrowLeftRight, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 rounded-lg p-2 bg-background/80 backdrop-blur-sm border md:hidden"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-sidebar p-4 hidden md:block">
        <div className="mb-8 px-4 py-2">
          <h1 className="text-xl font-semibold text-sidebar-foreground">Hedera Tracker</h1>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-sidebar p-6 z-50 md:hidden"
            >
              <div className="mb-8">
                <h1 className="text-xl font-semibold text-sidebar-foreground">Hedera Tracker</h1>
              </div>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavItem 
                    key={item.href} 
                    item={item} 
                    isActive={pathname === item.href}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ item, isActive, onClick }: { 
  item: typeof navItems[number], 
  isActive: boolean,
  onClick?: () => void 
}) {
  return (
    <Link
      href={item.href}
      className="relative block"
      onClick={onClick}
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
}
