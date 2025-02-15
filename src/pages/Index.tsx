import { Header } from "@/components/Header";
import { TokenCard } from "@/components/TokenCard";
import { PresaleCard } from "@/components/PresaleCard";
import {
  formatCurrency,
  formatTimeRemaining,
  getProgressPercent,
} from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useApplicationData } from "@/context/ApplicationDataContext";
import { useState, useEffect } from "react";
import { AUCTION_START_TIME } from "@/config/constants";

const Index = () => {
  const navigate = useNavigate();
  const { livePresale, upcomingPresales, endedPresales, isLoadingPresales } =
    useApplicationData();

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [timeRemainingAuction, setTimeRemainingAuction] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!livePresale) return;

    const updateTimer = () => {
      setTimeRemaining(
        formatTimeRemaining(livePresale.startAt, livePresale.endAt)
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval);
  }, [livePresale]);

  useEffect(() => {
    if (!livePresale) return;

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
  }, [livePresale]);

  if (isLoadingPresales) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] bg-gradient-to-br from-[#0A0B0F] via-[#0f1720] to-[#0A0B0F]">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="animate-pulse bg-gray-800 h-8 w-48 mx-auto rounded mb-4" />
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-[#0E1015] rounded-lg p-6 border border-gray-800 h-32"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] bg-gradient-to-br from-[#0A0B0F] via-[#0f1720] to-[#0A0B0F]">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white">
              Live ETF
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Discover and participate in the future of decentralized ETF
              investments
            </p>
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                Auction Starts in
              </div>
              <div className="text-3xl font-bold text-white">
                <div className="text-lg font-semibold text-white">
                  {timeRemainingAuction.days}d {timeRemainingAuction.hours}h{" "}
                  {timeRemainingAuction.minutes}m {timeRemainingAuction.seconds}
                  s
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                Committed
              </div>
              <div className="text-3xl font-bold text-white">
                {formatCurrency(livePresale?.totalRaised || "0")}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                Participants
              </div>
              <div className="text-3xl font-bold text-white">
                {livePresale?.participants || 0}
              </div>
            </div>
          </div>

          {livePresale && (
            <div className="bg-gradient-to-br from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 sm:p-8 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-8">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {livePresale.title}
                    </h2>
                    <span
                      className={`${
                        timeRemaining.days === 0 &&
                        timeRemaining.hours === 0 &&
                        timeRemaining.minutes === 0 &&
                        timeRemaining.seconds === 0
                          ? "bg-red-500/10 text-red-500"
                          : "bg-[#00FFB7]/10 text-[#00FFB7]"
                      } px-3 py-1 rounded-full text-sm font-medium inline-flex items-center w-fit`}
                    >
                      {timeRemaining.days === 0 &&
                      timeRemaining.hours === 0 &&
                      timeRemaining.minutes === 0 &&
                      timeRemaining.seconds === 0
                        ? "Ended"
                        : "Live"}
                    </span>
                  </div>
                  <p className="text-gray-400 max-w-2xl mb-6">
                    {livePresale.description}
                  </p>

                  {/* Progress and Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        Time Remaining
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {timeRemaining.days}d {timeRemaining.hours}h{" "}
                        {timeRemaining.minutes}m {timeRemaining.seconds}s
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        Participants
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {livePresale.participants}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Progress</div>
                      <div className="text-lg font-semibold text-white">
                        {getProgressPercent(
                          livePresale.totalRaised,
                          livePresale.targetAmount
                        )}
                        %
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#0A0B0F] rounded-full h-2">
                    <div
                      className="bg-[#00FFB7] h-2 rounded-full"
                      style={{
                        width: `${getProgressPercent(
                          livePresale.totalRaised,
                          livePresale.targetAmount
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/presale/${livePresale._id}`)}
                  className="w-full sm:w-auto bg-[#00FFB7] hover:bg-[#00E6A5] text-black font-semibold py-2 px-6 rounded-lg flex items-center justify-center"
                >
                  Participate →
                </button>
              </div>
            </div>
          )}

          {/* <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Previous Presales
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-4"></div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingPresales.map((presale) => (
                <TokenCard
                  key={presale._id}
                  name={presale.title}
                  symbol={presale.presaleToken}
                  marketCap={Number(presale.marketCap)}
                  remaining={
                    Number(presale.targetAmount) - Number(presale.totalRaised)
                  }
                  status="tba"
                  totalParticipants={presale.participants}
                  totalDeposits={Number(presale.totalRaised)}
                  onClick={() => navigate(`/presale/${presale._id}`)}
                />
              ))}
              {endedPresales.map((presale) => (
                <TokenCard
                  key={presale._id}
                  name={presale.title}
                  symbol={presale.presaleToken}
                  marketCap={Number(presale.marketCap)}
                  remaining={
                    Number(presale.targetAmount) - Number(presale.totalRaised)
                  }
                  status="ended"
                  totalParticipants={presale.participants}
                  totalDeposits={Number(presale.totalRaised)}
                  onClick={() => navigate(`/presale/${presale._id}`)}
                />
              ))}
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Index;
