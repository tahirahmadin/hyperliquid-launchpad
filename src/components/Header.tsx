import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { UserBalance } from "./UserBalance";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B0F] border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-semibold text-white mr-8 cursor-pointer"
          >
            HedgewaterETFs
          </h1>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              onClick={() => navigate("/")}
              className={`cursor-pointer ${
                location.pathname === "/" ? "text-[#00FFB7]" : "text-white hover:text-[#00FFB7]"
              }`}
            >
              Discover
            </a>
            <a
              onClick={() => navigate("/staking")}
              className={`cursor-pointer ${
                location.pathname === "/staking" ? "text-[#00FFB7]" : "text-white hover:text-[#00FFB7]"
              }`}
            >
              Staking
            </a>
            <a href="#" className="text-white hover:text-[#00FFB7]">
              Eligibility
            </a>
            <a href="#" className="text-white hover:text-[#00FFB7]">
              FAQs
            </a>
          </nav>
          <button className="md:hidden text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
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
