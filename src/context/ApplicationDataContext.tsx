import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import axios from "axios";
import { config } from "@/config/env";
import {
  livePresale as initialLivePresale,
  upcomingPresale as initialUpcomingPresale,
  endedPresales as initialEndedPresales,
} from "@/config/presaleData";

const BASE_API_URL = config.apiUrl;

interface PresaleInfo {
  _id: string;
  title: string;
  description: string;
  presaleToken: string;
  startAt: string;
  endAt: string;
  adminWallet: string;
  totalRaised: string;
  participants: number;
  targetAmount: string;
  marketCap: string;
  auctionPrize?: string;
  minDeposit: string;
  maxDeposit: string;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationDataContextType {
  balance: string;
  updateBalance: () => Promise<void>;
  livePresale: PresaleInfo | null;
  upcomingPresales: PresaleInfo[];
  endedPresales: PresaleInfo[];
  updatePresaleInfo: () => Promise<void>;
  updatePresaleState: (presale: PresaleInfo) => void;
  isLoadingPresales: boolean;
  isLoadingUserInfo: boolean;
}

const ApplicationDataContext = createContext<
  ApplicationDataContextType | undefined
>(undefined);

export const ApplicationDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [balance, setBalance] = useState("");
  const [livePresale, setLivePresale] = useState<PresaleInfo | null>(
    initialLivePresale
  );
  const [upcomingPresales, setUpcomingPresales] = useState<PresaleInfo[]>([
    initialUpcomingPresale,
  ]);
  const [endedPresales, setEndedPresales] =
    useState<PresaleInfo[]>(initialEndedPresales);
  const [isLoadingPresales, setIsLoadingPresales] = useState(false);

  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  const { isConnected, address: account } = useAccount();

  async function fetchBalance() {
    if (!account) return;

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const body = {
        type: "clearinghouseState",
        user: account,
      };
      const res = await axios.post(`https://api.hyperliquid.xyz/info`, body, {
        headers: headers,
      });

      setBalance(res.data?.withdrawable || "0");
    } catch (e) {
      console.error("error fetching balance", e);
    }
  }

  async function fetchPresaleInfo(presaleId: string) {
    try {
      setIsLoadingPresales(false);
      // Replace this URL with your actual backend API endpoint
      const response = await axios.get(
        `${BASE_API_URL}/api/presales/${presaleId}`
      );

      const presaleData = response.data;

      setLivePresale({ _id: presaleData._id, ...presaleData });
      // if (live) {
      //   setLivePresale(live);
      // }

      // if (upcoming && Array.isArray(upcoming)) {
      //   setUpcomingPresales(upcoming);
      // }

      // if (ended && Array.isArray(ended)) {
      //   setEndedPresales(ended);
      // }
    } catch (e) {
      console.error("error fetching presale info", e);
      // On error, keep the initial data from presaleData.ts
      setLivePresale(initialLivePresale);
      // setUpcomingPresales([initialUpcomingPresale]);
      // setEndedPresales(initialEndedPresales);
    } finally {
      setIsLoadingPresales(false);
    }
  }

  const updateBalance = async () => {
    await fetchBalance();
  };

  const updatePresaleInfo = async () => {
    if (!livePresale?._id) return;
    await fetchPresaleInfo(livePresale._id);
  };

  // Initial fetch when wallet is connected
  useEffect(() => {
    if (account) {
      fetchBalance();
      fetchPresaleInfo(livePresale._id);
    }
  }, [account]);

  // Fetch presale info initially and every minute
  useEffect(() => {
    updatePresaleInfo();
    const interval = setInterval(() => {
      updatePresaleInfo();
    }, 10000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  const updatePresaleState = async (presale: PresaleInfo) => {
    if (!presale?._id) return;
    setLivePresale(presale);
  };

  const value = {
    balance,
    updateBalance,
    livePresale,
    upcomingPresales,
    endedPresales,
    updatePresaleInfo,
    updatePresaleState,
    isLoadingPresales,
    isLoadingUserInfo,
  };

  return (
    <ApplicationDataContext.Provider value={value}>
      {children}
    </ApplicationDataContext.Provider>
  );
};

export const useApplicationData = () => {
  const context = useContext(ApplicationDataContext);
  if (context === undefined) {
    throw new Error(
      "useApplicationData must be used within an ApplicationDataProvider"
    );
  }
  return context;
};
