import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, MapPin, Package, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSheet from './ProfileSheet';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Inicio' },
  { path: '/tickets', icon: Ticket, label: 'Tickets' },
  { path: '/areas', icon: MapPin, label: 'Áreas' },
  { path: '/inventario', icon: Package, label: 'Inventario' },
  { path: '/piscinas', icon: Droplets, label: 'Piscinas' },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const { user, users, login, isLoading } = useAuth();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const currentNav = navItems.find(n => n.path === location.pathname) || navItems[0];
  const logoSrc = dark
    ? 'https://clubmalvin.uy/wp-content/uploads/2016/07/logo-malvin-400.png'
    : '/escudo-malvin.png';
  const logoStyle: React.CSSProperties | undefined = dark
    ? undefined
    : {
        filter:
          'brightness(0) saturate(100%) invert(16%) sepia(91%) saturate(2057%) hue-rotate(191deg) brightness(92%) contrast(102%)',
      };

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center text-sm text-muted-foreground">Cargando sesión...</div>;
  }

  if (!user) {
    return <div className="h-screen w-full flex items-center justify-center text-sm text-muted-foreground">Inicia sesión</div>;
  }

  return (
    <div className="flex flex-col h-screen-dvh bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Club Malvín"
              className="h-8 w-auto"
              style={logoStyle}
            />
            <span className="text-xs font-light text-muted-foreground tracking-wide">
              {currentNav.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={user.id} onValueChange={(val) => login(val)}>
              <SelectTrigger className="h-8 text-xs border-none bg-secondary/50 rounded-lg max-w-[140px]">
                <SelectValue placeholder="Cambiar usuario" />
              </SelectTrigger>
              <SelectContent>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} <span className="text-[10px] text-muted-foreground ml-1">({u.role})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProfileSheet />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border safe-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center w-14 py-2 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-0 inset-x-0 mx-auto w-10 h-[2px] bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={`mt-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <span className={`text-[10px] tracking-wide mt-1 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground font-light'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
