import { Header } from "@/components/Header";
import { TokenCard } from "@/components/TokenCard";
import {
  formatCurrency,
  formatTimeRemaining,
  getProgressPercent,
} from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useApplicationData } from "@/context/ApplicationDataContext";
import { useState, useEffect } from "react";
import { AUCTION_START_TIME } from "@/config/constants";
import { Clock, Timer, TrendingDown, TrendingUp } from "lucide-react";

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

  const [activeTab, setActiveTab] = useState<"completed" | "ongoing">(
    "completed"
  );

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
    <div className="min-h-screen bg-[#000000] ">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://img.freepik.com/premium-vector/green-futuristic-abstract-background_3442-124.jpg?semt=ais_hybrid)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.01) 100%, rgba(0,0,0,0) 100%)",
        }}
      />
      <Header />

      <main className="container mx-auto px-2 pt-24 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white pt-8">
              Buy liquid on
              <br />
              HyperLiquid market
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Discover and participate in the future of decentralized ETF
              investments
            </p>
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-[#161616] from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                HDWT MarketCap
              </div>
              <div className="text-3xl font-bold text-white">
                <div className="text-lg font-semibold text-white">
                  $5,545,541
                </div>
              </div>
            </div>

            <div className="bg-[#161616] from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                Avg ROI
              </div>
              <div className="text-3xl font-bold text-white">14x</div>
            </div>

            <div className="bg-[#161616] from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-6 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20 group">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 group-hover:text-[#00FFB7]/70">
                Hype Ecosystem MCap
              </div>
              <div className="text-3xl font-bold text-white">
                9,000,000,000+
              </div>
            </div>
          </div>

          {/* Grid system */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-4"></div>
              </div>
              {livePresale && (
                <div className="bg-[#0E0E0E] rounded-lg p-6 border border-gray-800/50 mt-3">
                  <h2 className="text-2xl font-bold text-white pb-3">
                    Ongoing
                  </h2>
                  <div className="mb-3 bg-[#161616] from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-4 sm:p-4 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-8">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex mb-4">
                            <div className="border border-gray-700 rounded-xl">
                              <img
                                src="https://vaderai.ai/_next/image?url=%2Fbilly_bets.png&w=3840&q=75"
                                className="w-24 rounded-xl p-3"
                              />
                            </div>
                            <div className="ml-4 flex flex-col items-start justify-center gap-1">
                              <h2 className="text-xl font-bold text-white">
                                Billy Bets
                              </h2>
                              <div className="text-xs font-medium text-gray-400 ">
                                Ends in:1D 09:07:48
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              className={`${
                                !(
                                  timeRemaining.days === 0 &&
                                  timeRemaining.hours === 0 &&
                                  timeRemaining.minutes === 0 &&
                                  timeRemaining.seconds === 0
                                )
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-[#00FFB7]/10 text-[#00FFB7]"
                              } px-3 py-1 rounded-full text-sm font-medium inline-flex items-center w-fit`}
                            >
                              {!(
                                timeRemaining.days === 0 &&
                                timeRemaining.hours === 0 &&
                                timeRemaining.minutes === 0 &&
                                timeRemaining.seconds === 0
                              )
                                ? "• Ended"
                                : "• Live"}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {/* <div className="w-full bg-[#0A0B0F] rounded-full h-2">
                          <div
                            className="bg-[#00FFB7] h-2 rounded-full"
                            style={{
                              width: `${getProgressPercent(
                                livePresale.totalRaised + 80,
                                livePresale.targetAmount
                              )}%`,
                            }}
                          />
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 bg-[#161616] from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-4 sm:p-4 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-8">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex mb-4">
                            <div className="border border-gray-700 rounded-xl">
                              <img
                                src="https://framerusercontent.com/images/dDfhsjf2EngJOYVGsg3iP7Tr6Sk.jpg?lossless=1"
                                className="w-24 rounded-xl p-3"
                              />
                            </div>
                            <div className="ml-4 flex flex-col items-start justify-center gap-1">
                              <h2 className="text-xl font-bold text-white">
                                Griffain
                              </h2>
                              <div className="text-xs font-medium text-gray-400 ">
                                Starts in:4D 19:07:48
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              className={`${
                                !(
                                  timeRemaining.days === 0 &&
                                  timeRemaining.hours === 0 &&
                                  timeRemaining.minutes === 0 &&
                                  timeRemaining.seconds === 0
                                )
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-purple-500/10 text-purple-500"
                              } px-3 py-1 rounded-full text-sm font-medium inline-flex items-center w-fit`}
                            >
                              {!(
                                timeRemaining.days === 0 &&
                                timeRemaining.hours === 0 &&
                                timeRemaining.minutes === 0 &&
                                timeRemaining.seconds === 0
                              )
                                ? "• Ended"
                                : "• Upcoming"}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {/* <div className="w-full bg-[#0A0B0F] rounded-full h-2">
                          <div
                            className="bg-[#00FFB7] h-2 rounded-full"
                            style={{
                              width: `${getProgressPercent(
                                livePresale.totalRaised + 80,
                                livePresale.targetAmount
                              )}%`,
                            }}
                          />
                        </div> */}
                      </div>
                    </div>
                    {/* <button
                    onClick={() => navigate(`/presale/${livePresale._id}`)}
                    className=" mt-3 w-full sm:w-auto bg-[#00FFB7] hover:bg-[#00E6A5] text-black font-semibold py-2 px-6 rounded-lg flex items-center justify-center"
                  >
                    Participate →
                  </button> */}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-[#0E0E0E] rounded-lg p-6 border border-gray-800/50 mt-3">
              <h2 className="text-2xl font-bold text-white pb-3">Completed</h2>
              <div className="mb-3 bg-[#161616] from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-4 sm:p-4 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-8">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="flex mb-4">
                        <div className="border border-gray-700 rounded-xl">
                          <img
                            src="https://vaderai.ai/_next/image?url=%2Fbilly_bets.png&w=3840&q=75"
                            className="w-24 rounded-xl p-3"
                          />
                        </div>
                        <div className="ml-4 flex flex-col items-start justify-center gap-1">
                          <h2 className="text-xl font-bold text-white">
                            Billy Bets
                          </h2>
                          <div className="text-xs font-medium text-red-500">
                            Ended
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={`${
                            !(
                              timeRemaining.days === 0 &&
                              timeRemaining.hours === 0 &&
                              timeRemaining.minutes === 0 &&
                              timeRemaining.seconds === 0
                            )
                              ? "bg-red-500/10 text-red-500"
                              : "bg-[#00FFB7]/10 text-[#00FFB7]"
                          } px-3 py-1 rounded-full text-sm font-medium inline-flex items-center w-fit`}
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          15X
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3 bg-[#161616] from-[#0E1015] to-[#131B24] hover:from-[#0E1015] hover:via-[#131B24] hover:to-[#00FFB7]/10 rounded-lg p-4 sm:p-4 border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-[#00FFB7]/20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-8">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="flex mb-4">
                        <div className="border border-gray-700 rounded-xl">
                          <img
                            src="https://framerusercontent.com/images/dDfhsjf2EngJOYVGsg3iP7Tr6Sk.jpg?lossless=1"
                            className="w-24 rounded-xl p-3"
                          />
                        </div>
                        <div className="ml-4 flex flex-col items-start justify-center gap-1">
                          <h2 className="text-xl font-bold text-white">
                            Griffain
                          </h2>
                          <div className="text-xs font-medium text-red-500">
                            Ended
                          </div>
                        </div>
                      </div>
                      <div>
                        <div>
                          <div
                            className={`${
                              timeRemaining.days === 0 &&
                              timeRemaining.hours === 0 &&
                              timeRemaining.minutes === 0 &&
                              timeRemaining.seconds === 0
                                ? "bg-red-500/10 text-red-500"
                                : "bg-[#00FFB7]/10 text-[#00FFB7]"
                            } px-3 py-1 rounded-full text-sm font-medium inline-flex items-center w-fit`}
                          >
                            <TrendingDown className="w-4 h-4 mr-1" />
                            -3X
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
