import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmsButton } from "@/components/SmsButton";
import { BackToTop } from "@/components/BackToTop";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import RVDetail from "./pages/RVDetail";
import TradeIn from "./pages/TradeIn";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Financing from "./pages/Financing";
import Favorites from "./pages/Favorites";
import OurPromise from "./pages/OurPromise";
import ApplyFinancing from "./pages/ApplyFinancing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

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
          <Route path="/about/our-promise" element={<OurPromise />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/apply-financing" element={<ApplyFinancing />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<Admin />} />
          {/* Legacy redirects */}
          <Route path="/customer-care" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <SmsButton />
      <BackToTop />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
