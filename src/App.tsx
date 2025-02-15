import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Web3ContextProvider from "./context/Web3ContextProvider";
import PresaleDetail from "./pages/PresaleDetail";
import Staking from "./pages/Staking";
import { AuthProvider } from "./context/AuthContext";
import { ApplicationDataProvider } from "./context/ApplicationDataContext";

const queryClient = new QueryClient();

const App = () => (
  <Web3ContextProvider cookies="">
    <AuthProvider>
      <ApplicationDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/presale/:id" element={<PresaleDetail />} />
                <Route path="/staking" element={<Staking />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </TooltipProvider>
      </ApplicationDataProvider>
    </AuthProvider>
  </Web3ContextProvider>
);

export default App;
