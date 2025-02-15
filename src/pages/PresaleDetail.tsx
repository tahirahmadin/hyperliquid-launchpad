import { useAccount } from "wagmi";
import { Header } from "@/components/Header";
import { useState, useEffect, useMemo } from "react";
import { useApplicationData } from "@/context/ApplicationDataContext";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProgressPercent,
  formatCurrency,
  formatTimeRemaining,
} from "@/lib/utils";
import { useDeposit } from "@/hooks/useDeposit";
import { useAuth } from "@/context/AuthContext";
import { AUCTION_START_TIME } from "@/config/constants";

const PresaleDetail = () => {
  const { id: presaleId } = useParams();
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState("");
  const {
    balance: usdcBalance,
    livePresale,
    upcomingPresales,
    endedPresales,
    isLoadingUserInfo,
    updateBalance,
    updatePresaleInfo,
  } = useApplicationData();

  const { userInfo, updateUserInfo } = useAuth();

  const { depositUSDC, trxState } = useDeposit();

  // Find the current presale based on the ID
  const currentPresale = presaleId
    ? livePresale?._id === presaleId
      ? livePresale
      : [...upcomingPresales, ...endedPresales].find((p) => p._id === presaleId)
    : null;

  useEffect(() => {
    if (!currentPresale) {
      navigate("/");
    }
  }, [currentPresale, navigate]);

  const handlePurchase = async (amount: string) => {
    if (!currentPresale) return;

    try {
      const res = await depositUSDC(
        presaleId,
        amount,
        currentPresale.adminWallet
      );

      console.log("res ", { res });
    } catch (error) {
      console.error("error depositing USDC", error);
      toast.error(`${error}`);
      return;
    }

    // check balance after 5 seconds
    setTimeout(() => {
      updateBalance();
      // updateUserInfo();
      updatePresaleInfo();
    }, 5000);

    // call again after 15 seconds
    setTimeout(() => {
      updateBalance();
      // updateUserInfo();
      updatePresaleInfo();
    }, 15000);
  };

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!currentPresale) return;

    const updateTimer = () => {
      setTimeRemaining(
        formatTimeRemaining(currentPresale.startAt, currentPresale.endAt)
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval);
  }, [currentPresale]);

  const [timeRemainingAuction, setTimeRemainingAuction] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!currentPresale) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const auctionStart = new Date(AUCTION_START_TIME).getTime();

      if (now >= auctionStart) {
        // If time has ended, show all zeros
        setTimeRemainingAuction({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTimeRemainingAuction(
        formatTimeRemaining(new Date().toString(), AUCTION_START_TIME)
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval);
  }, [currentPresale]);

  const handleMax = () => {
    // if balance is greater than max allocation , set it to max
    if (Number(usdcBalance) > Number(currentPresale.maxDeposit)) {
      setDepositAmount(currentPresale.maxDeposit || "0");
      return;
    }

    setDepositAmount(usdcBalance || "0");
  };

  const isTimeExpired = useMemo(() => {
    return (
      timeRemaining.days === 0 &&
      timeRemaining.hours === 0 &&
      timeRemaining.minutes === 0 &&
      timeRemaining.seconds === 0
    );
  }, [timeRemaining]);

  const isDisabled = useMemo(() => {
    return (
      !depositAmount ||
      Number(depositAmount) <= 0 ||
      trxState === "confirming" ||
      trxState === "pending" ||
      Number(depositAmount) > Number(usdcBalance) ||
      isTimeExpired
    );
  }, [trxState, depositAmount, usdcBalance, isTimeExpired]);

  const buttonText = useMemo(() => {
    if (isTimeExpired) {
      return "Presale ended";
    }

    if (Number(depositAmount) > Number(usdcBalance)) {
      return "Insufficient Balance";
    }

    if (trxState === "confirming") {
      return "Confirming...";
    }

    if (trxState === "pending") {
      return "Pending...";
    }

    return "Deposit";
  }, [trxState, depositAmount, usdcBalance, isTimeExpired]);

  if (!currentPresale) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] bg-gradient-to-br from-[#0A0B0F] via-[#0f1720] to-[#0A0B0F]">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center text-white">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] bg-gradient-to-br from-[#0A0B0F] via-[#0f1720] to-[#0A0B0F]">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 sm:p-8 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {currentPresale.title}
                  </h1>
                  <p className="text-gray-400">{currentPresale.description}</p>
                </div>
              </div>
              <div className="shrink-0">
                <div className="text-sm text-gray-400 mb-1">
                  AUCTION STARTS IN
                </div>
                <div className="text-xl font-semibold text-white">
                  {timeRemainingAuction.days}d {timeRemainingAuction.hours}h{" "}
                  {timeRemainingAuction.minutes}m {timeRemainingAuction.seconds}
                  s
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">
                  {getProgressPercent(
                    currentPresale.totalRaised,
                    currentPresale.targetAmount
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-[#0A0B0F] rounded-full h-2">
                <div
                  className="bg-[#00FFB7] h-2 rounded-full"
                  style={{
                    width: `${getProgressPercent(
                      currentPresale.totalRaised,
                      currentPresale.targetAmount
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
              <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                  Market Cap
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(currentPresale?.marketCap || "0")}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                  Total Raised
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(currentPresale?.totalRaised || "0")}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                  Participants
                </div>
                <div className="text-3xl font-bold text-white">
                  {currentPresale?.participants || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Deposit Section */}
          <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 sm:p-8 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20">
            <h2 className="text-xl font-bold text-white mb-6">Deposit</h2>

            <div className="space-y-6">
              {/* Balance Display */}
              {/* <div>
                <div className="text-sm text-gray-400 mb-1">Your Balance</div>
                <div className="text-lg font-semibold text-white">
                  {usdcBalance || "0"} USDC
                </div>
              </div> */}

              {/* User's Presale Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-4 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
                  <div className="text-sm text-gray-400 group-hover:text-[#00FFB7]/70 mb-1">
                    Your Deposits
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {isLoadingUserInfo ? (
                      <div className="animate-pulse bg-gray-800 h-6 w-24 rounded" />
                    ) : (
                      `${formatCurrency(userInfo?.depositBalance || "0")} USDC`
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-4 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
                  <div className="text-sm text-gray-400 group-hover:text-[#00FFB7]/70 mb-1">
                    Your Allocation
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {isLoadingUserInfo ? (
                      <div className="animate-pulse bg-gray-800 h-6 w-24 rounded" />
                    ) : (
                      formatCurrency(livePresale?.maxDeposit || 0)
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-4 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
                  <div className="text-sm text-gray-400 group-hover:text-[#00FFB7]/70 mb-1">
                    Time Remaining
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {timeRemaining.days}d {timeRemaining.hours}h{" "}
                    {timeRemaining.minutes}m {timeRemaining.seconds}s
                  </div>
                </div>
              </div>

              {/* Input Field */}
              <div>
                <div className="flex justify-between mb-2">
                  <div className="text-sm text-gray-400">Amount</div>
                  <div className="text-sm text-gray-400">
                    Balance: {usdcBalance || "0"} USDC
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-[#0A0B0F] text-white p-3 rounded-lg border border-gray-800 focus:outline-none focus:border-[#00FFB7]"
                    placeholder="Enter amount"
                  />
                  <button
                    onClick={handleMax}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-[#00FFB7] text-black rounded-lg hover:bg-opacity-80 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handlePurchase(depositAmount)}
                disabled={isDisabled}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isDisabled
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-[#00FFB7] text-black hover:bg-opacity-80"
                }`}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PresaleDetail;
