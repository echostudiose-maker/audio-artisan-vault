import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Music from "./pages/Music";
import SoundEffects from "./pages/SoundEffects";
import Explore from "./pages/Explore";
import Favorites from "./pages/Favorites";
import Downloads from "./pages/Downloads";
import Playlists from "./pages/Playlists";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import License from "./pages/License";
import Welcome from "./pages/Welcome";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <PlayerProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/music" element={<Music />} />
                <Route path="/sfx" element={<SoundEffects />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/license" element={<License />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <WhatsAppButton />
            </BrowserRouter>
          </TooltipProvider>
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
