import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DepositModalProps {
  symbol: string;
  onDeposit: (amount: string) => void;
}

export const DepositModal = ({ symbol, onDeposit }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive",
      });
      return;
    }
    onDeposit(amount);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Deposit USDC
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Deposit {symbol}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Amount to Deposit (USDC)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter USDC amount..."
              className="bg-white/50 border-white/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Minimum Deposit</span>
              <span>100 USDC</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Maximum Deposit</span>
              <span>10,000 USDC</span>
            </div>
          </div>
          <Button onClick={handleDeposit}>Confirm Deposit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};