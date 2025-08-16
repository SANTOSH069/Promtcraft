import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lab from "./pages/Lab";
import ImageLab from "./pages/lab/ImageLab";
import VideoLab from "./pages/lab/VideoLab";
import NotionLab from "./pages/lab/NotionLab";
import ThreadsLab from "./pages/lab/ThreadsLab";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/lab/image" element={<ImageLab />} />
              <Route path="/lab/video" element={<VideoLab />} />
              <Route path="/lab/notion" element={<NotionLab />} />
              <Route path="/lab/threads" element={<ThreadsLab />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
