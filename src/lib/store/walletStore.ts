import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Wallet {
  address: string;
  isActive: boolean;
  dateAdded: string;
}

interface WalletStore {
  wallets: Wallet[];
  addWallet: (address: string) => void;
  activateWallet: (address: string) => void;
  deactivateWallet: (address: string) => void;
  removeWallet: (address: string) => void;
  getActiveWallet: () => Wallet | undefined;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      wallets: [],
      addWallet: (address) => {
        const wallet: Wallet = {
          address,
          isActive: get().wallets.length === 0, // First wallet is active by default
          dateAdded: new Date().toISOString(),
        };
        set((state) => ({
          wallets: [...state.wallets, wallet],
        }));
      },
      activateWallet: (address) => {
        set((state) => ({
          wallets: state.wallets.map((w) => ({
            ...w,
            isActive: w.address === address,
          })),
        }));
      },
      deactivateWallet: (address) => {
        set((state) => ({
          wallets: state.wallets.map((w) => ({
            ...w,
            isActive: w.address === address ? false : w.isActive,
          })),
        }));
      },
      removeWallet: (address) => {
        set((state) => ({
          wallets: state.wallets.filter((w) => w.address !== address),
        }));
      },
      getActiveWallet: () => {
        const state = get();
        return state.wallets.find((w) => w.isActive);
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);
