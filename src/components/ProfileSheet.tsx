import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, Mail, Phone, MapPin, Shield, Camera, LogOut, Clock, Calendar, RefreshCcw, Award, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProfileSheet = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  // Detailed profile query
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetch(`/api/staff/profile/${user?.id}`).then(r => r.json()),
    enabled: !!user?.id && open
  });

  const toggleStatus = useMutation({
    mutationFn: (newStatus: string) => 
      fetch(`/api/staff/profile/${user?.id}/clock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).then(r => r.json()),
    onSuccess: (data) => {
      toast.success(`Turno ${data.status === 'ON_DUTY' ? 'iniciado' : 'finalizado'}`);
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    }
  });

  // Demo requests
  const requestLeave = useMutation({
    mutationFn: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 2);
      return fetch(`/api/staff/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          startDate: tomorrow.toISOString(),
          endDate: nextDay.toISOString(),
          reason: 'Día libre solicitado desde app'
        })
      }).then(r => r.json());
    },
    onSuccess: () => {
      toast.success('Solicitud de licencia enviada');
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    }
  });

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center relative active:scale-95 transition-transform">
          <span className="text-xs font-medium text-primary">{initials}</span>
          {profile?.status === 'ON_DUTY' && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-background rounded-full"></span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto p-0 hide-scrollbar">
        {/* Header */}
        <div className="flex flex-col items-center pt-6 pb-4 px-6 relative">
          <div className="relative mb-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${profile?.status === 'ON_DUTY' ? 'bg-success' : 'bg-primary'}`}>
              <span className="text-lg font-light text-white">{initials}</span>
            </div>
          </div>
          <p className="text-sm font-normal">{user.name}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>

          <Button 
            variant={profile?.status === 'ON_DUTY' ? 'destructive' : 'default'}
            size="sm" 
            className="mt-4 w-full h-9 rounded-xl text-xs font-medium"
            onClick={() => toggleStatus.mutate(profile?.status === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY')}
            disabled={toggleStatus.isPending || isLoading}
          >
            <Clock size={14} className="mr-2" />
            {profile?.status === 'ON_DUTY' ? 'Finalizar Turno (Clock Out)' : 'Iniciar Turno (Clock In)'}
          </Button>
        </div>

        <Separator />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-6 py-3.5 active:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {dark ? <Moon size={16} strokeWidth={1.5} className="text-muted-foreground" /> : <Sun size={16} strokeWidth={1.5} className="text-muted-foreground" />}
            <span className="text-xs font-normal">{dark ? 'Modo nocturno' : 'Modo diurno'}</span>
          </div>
          <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${dark ? 'bg-primary' : 'bg-border'}`}>
            <div className={`w-4 h-4 rounded-full bg-card shadow-sm transition-transform ${dark ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        <Separator />

        {/* Work Information & Requests */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-[10px] text-muted-foreground tracking-wide uppercase font-medium">Gestión de Turnos y Licencias</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8" onClick={() => requestLeave.mutate()}>
              <Calendar size={12} className="mr-1.5" /> Pedir Licencia
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8" onClick={() => toast.info('Funcionalidad en desarrollo')}>
              <RefreshCcw size={12} className="mr-1.5" /> Cambiar Turno
            </Button>
          </div>
        </div>

        <Separator />

        {/* Certifications */}
        {profile?.certifications?.length > 0 && (
          <>
            <div className="px-6 py-4">
              <p className="text-[10px] text-muted-foreground tracking-wide uppercase font-medium mb-3">Certificaciones</p>
              <div className="space-y-2">
                {profile.certifications.map((cert: any) => {
                  const isExpired = new Date(cert.expirationDate) < new Date();
                  return (
                    <div key={cert.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-2.5">
                      <div className="flex items-center gap-2.5">
                        <Award size={14} className={isExpired ? 'text-destructive' : 'text-success'} />
                        <div>
                          <p className="text-xs font-medium">{cert.name}</p>
                          <p className="text-[9px] text-muted-foreground">Vence: {new Date(cert.expirationDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant={isExpired ? 'destructive' : 'outline'} className="text-[8px] px-1.5 py-0">
                        {isExpired ? 'VENCIDA' : 'VIGENTE'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Profile Info */}
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase font-medium">Información de Contacto</p>
          </div>
          <div className="space-y-0">
            <div className="flex items-center gap-3 py-2.5">
              <Mail size={14} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground">Correo</p>
                <p className="text-xs font-normal truncate">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 py-2.5">
                <Phone size={14} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground">Teléfono</p>
                  <p className="text-xs font-normal">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Logout */}
        <div className="px-6 py-4 pb-8">
          <button onClick={() => { setOpen(false); logout(); }} className="flex items-center gap-3 text-red-500 py-2 w-full active:bg-red-500/10 rounded-lg px-2 transition-colors">
            <LogOut size={14} strokeWidth={1.5} />
            <span className="text-xs font-normal">Cerrar sesión</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;
