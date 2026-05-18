import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, UserPlus, Clock, CheckCircle2, XCircle, Calendar, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Staff = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'users' | 'leaves' | 'swaps'>('users');

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  });

  const { data: leaves = [], isLoading: loadingLeaves } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => fetch('/api/staff/leaves').then(r => r.json())
  });

  const { data: swaps = [], isLoading: loadingSwaps } = useQuery({
    queryKey: ['swaps'],
    queryFn: () => fetch('/api/staff/swaps').then(r => r.json())
  });

  const updateLeave = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      fetch(`/api/staff/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).then(r => r.json()),
    onSuccess: () => {
      toast.success('Licencia actualizada');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    }
  });

  const updateSwap = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      fetch(`/api/staff/swaps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).then(r => r.json()),
    onSuccess: () => {
      toast.success('Cambio de turno actualizado');
      queryClient.invalidateQueries({ queryKey: ['swaps'] });
    }
  });

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-UY');

  if (loadingUsers || loadingLeaves || loadingSwaps) {
    return <div className="p-4 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="px-4 py-5 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Staff</h1>
          <p className="text-xs text-muted-foreground mt-1">Gestión de personal y horarios</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'users', label: 'Directorio', icon: Users },
          { id: 'leaves', label: 'Licencias', icon: Calendar },
          { id: 'swaps', label: 'Cambios Turno', icon: RefreshCcw }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.map((u: any) => (
              <div key={u.id} className="bg-card rounded-xl p-3 shadow-sm flex items-center justify-between border border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${u.status === 'ON_DUTY' ? 'bg-success' : 'bg-muted-foreground'}`} />
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{u.role}</p>
                  </div>
                </div>
                <Badge variant={u.status === 'ON_DUTY' ? 'default' : 'secondary'} className="text-[9px]">
                  {u.status === 'ON_DUTY' ? 'TRABAJANDO' : 'INACTIVO'}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="space-y-3">
            {leaves.length === 0 && <p className="text-xs text-muted-foreground text-center">No hay solicitudes de licencia.</p>}
            {leaves.map((l: any) => (
              <div key={l.id} className="bg-card rounded-xl p-3 shadow-sm border border-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-semibold">{l.user.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(l.startDate)} - {formatDate(l.endDate)}</p>
                  </div>
                  <Badge variant={l.status === 'PENDING' ? 'outline' : l.status === 'APPROVED' ? 'default' : 'destructive'} className="text-[9px]">
                    {l.status}
                  </Badge>
                </div>
                <p className="text-xs italic text-muted-foreground bg-secondary/50 p-2 rounded-lg mb-3">"{l.reason}"</p>
                
                {l.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-7 text-[10px]" onClick={() => updateLeave.mutate({ id: l.id, status: 'APPROVED' })}>
                      <CheckCircle2 size={12} className="mr-1" /> Aprobar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] text-destructive hover:text-destructive" onClick={() => updateLeave.mutate({ id: l.id, status: 'REJECTED' })}>
                      <XCircle size={12} className="mr-1" /> Rechazar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'swaps' && (
          <div className="space-y-3">
            {swaps.length === 0 && <p className="text-xs text-muted-foreground text-center">No hay solicitudes de cambio de turno.</p>}
            {swaps.map((s: any) => (
              <div key={s.id} className="bg-card rounded-xl p-3 shadow-sm border border-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-semibold">{s.requester.name} ⟷ {s.recipient.name}</p>
                    <p className="text-[10px] text-muted-foreground">Día: {formatDate(s.dateToSwap)}</p>
                  </div>
                  <Badge variant={s.status === 'PENDING' ? 'outline' : s.status === 'APPROVED' ? 'default' : 'destructive'} className="text-[9px]">
                    {s.status}
                  </Badge>
                </div>
                <p className="text-xs italic text-muted-foreground bg-secondary/50 p-2 rounded-lg mb-3">"{s.reason}"</p>
                
                {s.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-7 text-[10px]" onClick={() => updateSwap.mutate({ id: s.id, status: 'APPROVED' })}>
                      <CheckCircle2 size={12} className="mr-1" /> Aprobar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] text-destructive hover:text-destructive" onClick={() => updateSwap.mutate({ id: s.id, status: 'REJECTED' })}>
                      <XCircle size={12} className="mr-1" /> Rechazar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
