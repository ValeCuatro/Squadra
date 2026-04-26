import { useState } from 'react';
import { Moon, Sun, Mail, Phone, MapPin, Shield, Camera, ChevronRight, LogOut } from 'lucide-react';
import { currentUser } from '@/data/mock';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ProfileSheet = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');

  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

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

  const initials = currentUser.name.split(' ').map(n => n[0]).join('');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center active:scale-95 transition-transform">
          <span className="text-xs font-medium text-primary">{initials}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto p-0">
        {/* Profile Header */}
        <div className="flex flex-col items-center pt-6 pb-4 px-6">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-lg font-light text-primary-foreground">{initials}</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center">
              <Camera size={10} className="text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm font-normal">{currentUser.name}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{currentUser.role}</p>
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

        {/* Profile Info */}
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase font-medium">Información personal</p>
            <button
              onClick={() => setEditing(!editing)}
              className="text-[10px] text-primary font-normal"
            >
              {editing ? 'Guardar' : 'Editar'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Nombre</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="text-xs rounded-xl h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Correo</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} className="text-xs rounded-xl h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Teléfono</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} className="text-xs rounded-xl h-9" />
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              <div className="flex items-center gap-3 py-2.5">
                <Mail size={14} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground">Correo</p>
                  <p className="text-xs font-normal truncate">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2.5">
                <Phone size={14} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground">Teléfono</p>
                  <p className="text-xs font-normal">{phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Work Info (read only) */}
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] text-muted-foreground tracking-wide uppercase font-medium mb-3">Información laboral</p>
          <div className="flex items-center gap-3 py-2.5">
            <Shield size={14} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground">Rol</p>
              <p className="text-xs font-normal capitalize">{currentUser.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2.5">
            <MapPin size={14} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground">Área asignada</p>
              <p className="text-xs font-normal">{currentUser.area}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Logout */}
        <div className="px-6 py-4 pb-8">
          <button className="flex items-center gap-3 text-red-500 dark:text-red-400 py-2">
            <LogOut size={14} strokeWidth={1.5} />
            <span className="text-xs font-normal">Cerrar sesión</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;
