import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import RVDetail from "./pages/RVDetail";
import TradeIn from "./pages/TradeIn";
import About from "./pages/About";
import CustomerCare from "./pages/CustomerCare";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Portal from "./pages/Portal";
import PortalChat from "./pages/PortalChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  usePageTracking();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/rv/:id" element={<RVDetail />} />
          <Route path="/trade-in" element={<TradeIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/customer-care" element={<CustomerCare />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/portal/chat/:conversationId" element={<PortalChat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
