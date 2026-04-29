import { useEffect, useMemo, useState } from 'react';
import { Plus, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { currentUser, type Ticket } from '@/data/mock';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import TicketCard from '@/components/tickets/TicketCard';
import TicketDetailSheet from '@/components/tickets/TicketDetailSheet';
import { statusConfig } from '@/components/tickets/ticket-config';

const Tickets = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [openCreate, setOpenCreate] = useState(false);
  
  const { data: ticketList = [] } = useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: () => fetch('/api/tickets').then(r => r.json())
  });

  const { data: areas = [] } = useQuery<any[]>({
    queryKey: ['areas'],
    queryFn: () => fetch('/api/areas').then(r => r.json())
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  });

  const [filterUser, setFilterUser] = useState<string>(currentUser.id);
  const [activeStatus, setActiveStatus] = useState<Ticket['status']>('pendiente');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubArea, setSelectedSubArea] = useState('');
  const [newPriority, setNewPriority] = useState('media');
  const [newAssignee, setNewAssignee] = useState('');

  const subAreas = areas.find((a: any) => a.id === selectedArea)?.subAreas || [];
  
  const selectedTicket = useMemo(
    () => ticketList.find((ticket: Ticket) => ticket.id === selectedTicketId) ?? null,
    [selectedTicketId, ticketList]
  );

  useEffect(() => {
    const state = location.state as { openTicketId?: string; statusFilter?: Ticket['status'] } | null;
    if (!state) return;
    if (state.statusFilter) setActiveStatus(state.statusFilter);
    if (state.openTicketId) setSelectedTicketId(state.openTicketId);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const filterByStatus = (status: string) =>
    ticketList.filter((t: any) => {
      const matchStatus = t.status === status;
      const assigneeId = t.assigneeId || (t.assignee && t.assignee.id);
      const matchUser = filterUser === 'all' || assigneeId === filterUser;
      return matchStatus && matchUser;
    });

  const handleOpenTicket = (ticket: Ticket) => {
    setActiveStatus(ticket.status);
    setSelectedTicketId(ticket.id);
  };

  const createTicketMutation = useMutation({
    mutationFn: (newTicket: any) => fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setOpenCreate(false);
      setNewTitle('');
      setNewDesc('');
      setSelectedArea('');
      setSelectedSubArea('');
      setNewPriority('media');
      setNewAssignee('');
    }
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: ({ id, status, note }: any) => fetch(`/api/tickets/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note })
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });

  const handleCreate = () => {
    if (!newTitle || !selectedArea) return;
    createTicketMutation.mutate({
      title: newTitle,
      description: newDesc,
      areaId: selectedArea,
      subAreaId: selectedSubArea || undefined,
      priority: newPriority,
      assigneeId: newAssignee || undefined
    });
  };

  const handleSaveTicketUpdate = (ticketId: string, nextStatus: Ticket['status'], note: string) => {
    updateTicketStatusMutation.mutate({ id: ticketId, status: nextStatus, note });
    setActiveStatus(nextStatus);
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-normal">Tickets</h1>
        <Sheet open={openCreate} onOpenChange={setOpenCreate}>
          <SheetTrigger asChild>
            <Button size="sm" className="rounded-xl text-xs font-normal gap-1.5 h-8">
              <Plus size={14} /> Nuevo
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-sm font-medium">Nuevo ticket</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Título</Label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Describe brevemente el problema" className="text-sm rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Descripción</Label>
                <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Detalla el problema..." className="text-sm rounded-xl min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Área</Label>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {areas.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Sub-área</Label>
                  <Select value={selectedSubArea} onValueChange={setSelectedSubArea} disabled={!selectedArea}>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {subAreas.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Prioridad</Label>
                  <Select value={newPriority} onValueChange={setNewPriority}>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {['baja', 'media', 'alta', 'urgente'].map(p => (
                        <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Asignar a</Label>
                  <Select value={newAssignee} onValueChange={setNewAssignee}>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {users.filter((u: any) => u.role === 'FIELD_WORKER' || u.role === 'operario').map((u: any) => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                className="w-full rounded-xl text-sm font-normal" 
                onClick={handleCreate}
                disabled={createTicketMutation.isPending}
              >
                {createTicketMutation.isPending ? 'Creando...' : 'Crear ticket'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* User Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setFilterUser(currentUser.id)}
          className={`shrink-0 text-[10px] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
            filterUser === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
          }`}
        >
          <User size={10} /> Mis tickets
        </button>
        <button
          onClick={() => setFilterUser('all')}
          className={`shrink-0 text-[10px] px-3 py-1.5 rounded-full transition-colors ${
            filterUser === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
          }`}
        >
          Todos
        </button>
        {users.filter((u: any) => u.id !== currentUser.id).map((u: any) => (
          <button
            key={u.id}
            onClick={() => setFilterUser(u.id)}
            className={`shrink-0 text-[10px] px-3 py-1.5 rounded-full transition-colors ${
              filterUser === u.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
            }`}
          >
            {u.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value as Ticket['status'])} className="w-full">
        <TabsList className="w-full bg-card rounded-xl h-9">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <TabsTrigger key={key} value={key} className="flex-1 text-xs font-normal rounded-lg data-[state=active]:shadow-sm gap-1">
              <cfg.icon size={12} />
              {cfg.label}
              <span className="text-[10px] text-muted-foreground ml-0.5">
                ({filterByStatus(key).length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(statusConfig).map(status => (
          <TabsContent key={status} value={status} className="space-y-3 mt-3">
            {filterByStatus(status).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xs text-muted-foreground">No hay tickets</p>
              </div>
            ) : (
              filterByStatus(status).map((ticket: any) => (
                <TicketCard key={ticket.id} ticket={ticket} onOpen={handleOpenTicket} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      <TicketDetailSheet
        ticket={selectedTicket}
        open={Boolean(selectedTicket)}
        onOpenChange={(isOpen: boolean) => {
          if (!isOpen) setSelectedTicketId(null);
        }}
        onSave={handleSaveTicketUpdate}
      />
    </div>
  );
};

export default Tickets;
