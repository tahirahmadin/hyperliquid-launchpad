import { useAccount, useDisconnect } from "wagmi";
import { Wallet, Copy, Check, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useApplicationData } from "@/context/ApplicationDataContext";

export const UserBalance = () => {
  const { address, isConnected } = useAccount();

  const { balance: usdcBalance } = useApplicationData();

  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnect();
    setShowDropdown(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) return null;

  return (
    <div className="relative">
      <div
        className="flex items-center cursor-pointer group"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {/* USDC Balance Card */}
        <div className="bg-gradient-to-r from-[#0E1015] to-[#161920] rounded-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 border border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#00FFB7]/20">
          {/* Mobile View */}
          <div className="flex md:hidden items-center gap-2">
            <div className="bg-gradient-to-br from-[#00FFB7]/20 to-[#00FFB7]/10 p-1.5 rounded-lg">
              <Wallet className="w-4 h-4 text-[#00FFB7]" />
            </div>
            <div className="text-sm font-medium text-white flex items-center gap-1">
              {usdcBalance ? `${Number(usdcBalance).toFixed(1)}` : "0.0"}
              <span className="text-xs text-gray-400">USDC</span>
              <ChevronDown
                className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#00FFB7]/20 to-[#00FFB7]/10 p-2.5 rounded-lg">
              <Wallet className="w-5 h-5 text-[#00FFB7]" />
            </div>
            <div className="pr-2">
              <div className="text-base font-semibold text-white flex items-center gap-2">
                {usdcBalance
                  ? `${Number(usdcBalance).toFixed(2)} USDC`
                  : "0.00 USDC"}
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </div>
              {/* <div className="text-sm text-gray-400 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00FFB7]/50 animate-pulse" />
                {ethusdcBalance
                  ? `${Number(ethusdcBalance.formatted).toFixed(4)} ETH`
                  : "0.0000 ETH"}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-72 bg-gradient-to-b from-[#0E1015] to-[#161920] rounded-xl shadow-2xl border border-gray-800/50 p-4 z-50 backdrop-blur-sm mx-4 sm:mx-0">
          <div className="space-y-4">
            {/* Wallet Section */}
            <div>
              <div className="text-sm text-gray-400 mb-2">Connected Wallet</div>
              <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                <div className="flex-1 font-mono text-sm text-white break-all">
                  {address && formatAddress(address)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyAddress();
                  }}
                  className="text-[#00FFB7] hover:text-[#00E6A5] p-1.5 rounded-lg transition-colors hover:bg-[#00FFB7]/10 flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Balance Section */}
            <div>
              <div className="text-sm text-gray-400 mb-2">Your Balance</div>
              <div className="space-y-2">
                <div className="bg-black/20 p-2 rounded-lg flex justify-between items-center">
                  <span className="text-white">USDC</span>
                  <span className="text-[#00FFB7] font-medium">
                    {usdcBalance ? Number(usdcBalance).toFixed(2) : "0.00"}
                  </span>
                </div>
                {/* <div className="bg-black/20 p-2 rounded-lg flex justify-between items-center">
                  <span className="text-white">ETH</span>
                  <span className="text-[#00FFB7] font-medium">
                    {ethBalance
                      ? Number(ethBalance.formatted).toFixed(4)
                      : "0.0000"}
                  </span>
                </div> */}
              </div>
            </div>

            {/* Logout Section */}
            <div className="pt-2 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-2 py-2 text-gray-400 hover:text-white hover:bg-black/20 rounded-lg transition-colors"
              >
                <span className="text-sm">Disconnect Wallet</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};
