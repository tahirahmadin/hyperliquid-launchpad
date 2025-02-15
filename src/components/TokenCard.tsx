import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign, Users, Wallet } from "lucide-react";
import { DepositModal } from "./DepositModal";

type PresaleStatus = "display" | "live" | "tba" | "ended" | "open";

interface TokenCardProps {
  name: string;
  symbol: string;
  marketCap: number;
  remaining: number;
  status?: PresaleStatus;
  totalParticipants?: number;
  totalDeposits?: number;
  onClick?: () => void;
}

export const TokenCard = ({
  name,
  symbol,
  marketCap,
  remaining,
  status = "live",
  totalParticipants = 0,
  totalDeposits = 0,
  onClick,
}: TokenCardProps) => {
  const { toast } = useToast();

  const handlePurchase = (amount: string) => {
    toast({
      title: "Purchase Initiated",
      description: `Attempting to purchase ${amount} ${symbol} with USDC`,
    });
  };

  const statusConfig = {
    display: {
      icon: <TrendingUp className="w-5 h-5" />,
      style: "bg-blue-500/10 text-blue-400",
    },
    live: {
      icon: <DollarSign className="w-5 h-5" />,
      style: "bg-[#00FFB7]/10 text-[#00FFB7]",
    },
    tba: {
      icon: <Clock className="w-5 h-5" />,
      style: "bg-purple-500/10 text-purple-400",
    },
    ended: {
      icon: <CheckCircle className="w-5 h-5" />,
      style: "bg-gray-500/10 text-gray-400",
    },
    open: {
      icon: <AlertCircle className="w-5 h-5" />,
      style: "bg-orange-500/10 text-orange-400",
    },
  };

  return (
    <div className="bg-[#0E1015] rounded-lg p-6 border border-gray-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{name}</h3>
          <div className="text-sm text-gray-400">${symbol}</div>
        </div>
        <div className={cn("px-3 py-1 rounded-full flex items-center gap-1.5", statusConfig[status].style)}>
          {statusConfig[status].icon}
          <span className="text-sm font-medium capitalize">{status}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-sm text-gray-400 mb-1">Market Cap</div>
            <div className="text-lg font-semibold text-white">
              {formatCurrency(marketCap)}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Remaining</span>
            <span className="text-white font-medium">{remaining.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Participants</span>
          <span className="text-white font-medium">{totalParticipants.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Deposits</span>
          <span className="text-white font-medium">
            {formatCurrency(totalDeposits)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        {status === "live" || status === "open" ? (
          <DepositModal onSubmit={handlePurchase}>
            <Button 
              className="w-full bg-[#00FFB7] hover:bg-[#00E6A5] text-black" 
              size="lg"
            >
              Purchase Tokens
            </Button>
          </DepositModal>
        ) : status === "ended" ? (
          <Button 
            className="w-full bg-gray-700 hover:bg-gray-600 cursor-not-allowed text-white" 
            size="lg" 
            disabled
          >
            Presale Ended
          </Button>
        ) : status === "tba" ? (
          <Button 
            className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400" 
            size="lg" 
            disabled
          >
            Coming Soon
          </Button>
        ) : (
          <Button 
            className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400" 
            size="lg" 
            disabled
          >
            Display Only
          </Button>
        )}
      </div>
    </div>
  );
};