import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { UserBalance } from "./UserBalance";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Header = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useAppKit();
  const { isAuthenticated, login, loading } = useAuth();

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to authenticate wallet");
    }
  };

  // useEffect(() => {
  //   if (isConnected && isAuthenticated) {
  //     toast.info("Wallet connected!");
  //   }
  // }, [isConnected, isAuthenticated]);

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Successfully connected and authenticated!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-black">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-semibold text-white mr-8 cursor-pointer flex items-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4515/4515497.png"
              className="h-12 w-12"
            />{" "}
            HedgewaterETFs
          </h1>
        </div>
        <Tabs value={location.pathname} className="hidden md:block">
          <TabsList className="bg-transparent border border-gray-800">
            <TabsTrigger
              value="/"
              onClick={() => navigate("/")}
              className="data-[state=active]:bg-[#00FFB7]/10 data-[state=active]:text-[#00FFB7] text-white"
            >
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="/staking"
              onClick={() => navigate("/staking")}
              className="data-[state=active]:bg-[#00FFB7]/10 data-[state=active]:text-[#00FFB7] text-white"
            >
              Staking
            </TabsTrigger>
            <TabsTrigger
              value="/eligibility"
              className="data-[state=active]:bg-[#00FFB7]/10 data-[state=active]:text-[#00FFB7] text-white"
            >
              Eligibility
            </TabsTrigger>
            <TabsTrigger
              value="/faqs"
              className="data-[state=active]:bg-[#00FFB7]/10 data-[state=active]:text-[#00FFB7] text-white"
            >
              FAQs
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-3 sm:gap-4">
          {!isConnected && (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="bg-[#00FFB7] hover:bg-[#00E6A5] text-black font-semibold py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
          {isConnected && !isAuthenticated && (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-[#00FFB7] hover:bg-[#00E6A5] text-black font-semibold py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Waiting..." : "Login"}
            </button>
          )}
          {isConnected && isAuthenticated && <UserBalance />}
        </div>
      </div>
    </header>
  );
};
