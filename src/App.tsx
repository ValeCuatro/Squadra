import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { DashboardSkeleton, TicketsSkeleton, AreasSkeleton, InventorySkeleton, PoolsSkeleton } from './components/PageSkeleton';
import NotFound from "./pages/NotFound";

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Areas = lazy(() => import('./pages/Areas'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Pools = lazy(() => import('./pages/Pools'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>} />
            <Route path="/tickets" element={<Suspense fallback={<TicketsSkeleton />}><Tickets /></Suspense>} />
            <Route path="/areas" element={<Suspense fallback={<AreasSkeleton />}><Areas /></Suspense>} />
            <Route path="/inventario" element={<Suspense fallback={<InventorySkeleton />}><Inventory /></Suspense>} />
            <Route path="/piscinas" element={<Suspense fallback={<PoolsSkeleton />}><Pools /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
