import { useEffect, useMemo, useState } from 'react';
import { Plus, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tickets as mockTickets, areas, users, currentUser, type Ticket } from '@/data/mock';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [ticketList, setTicketList] = useState(mockTickets);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [filterUser, setFilterUser] = useState<string>(currentUser.id);
  const [activeStatus, setActiveStatus] = useState<Ticket['status']>('pendiente');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const subAreas = areas.find(a => a.name === selectedArea)?.subAreas || [];
  const selectedTicket = useMemo(
    () => ticketList.find(ticket => ticket.id === selectedTicketId) ?? null,
    [selectedTicketId, ticketList]
  );

  useEffect(() => {
    const state = location.state as { openTicketId?: string; statusFilter?: Ticket['status'] } | null;

    if (!state) return;

    if (state.statusFilter) {
      setActiveStatus(state.statusFilter);
    }

    if (state.openTicketId) {
      setSelectedTicketId(state.openTicketId);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const filterByStatus = (status: string) =>
    ticketList.filter(t => {
      const matchStatus = t.status === status;
      const matchUser = filterUser === 'all' || t.assignee.id === filterUser;
      return matchStatus && matchUser;
    });

  const handleOpenTicket = (ticket: Ticket) => {
    setActiveStatus(ticket.status);
    setSelectedTicketId(ticket.id);
  };

  const handleSaveTicketUpdate = (ticketId: string, nextStatus: Ticket['status'], note: string) => {
    const now = new Date().toISOString();

    setTicketList(prev => prev.map(ticket => {
      if (ticket.id !== ticketId) return ticket;

      const statusChanged = ticket.status !== nextStatus;
      const nextComments = [...ticket.comments];

      if (statusChanged) {
        nextComments.push({
          user: currentUser.name,
          text: `Estado actualizado a ${nextStatus.replace('_', ' ')}.`,
          date: now,
        });
      }

      if (note.trim()) {
        nextComments.push({
          user: currentUser.name,
          text: note.trim(),
          date: now,
        });
      }

      return {
        ...ticket,
        status: nextStatus,
        updatedAt: now,
        comments: nextComments,
      };
    }));

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
                <Input placeholder="Describe brevemente el problema" className="text-sm rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Descripción</Label>
                <Textarea placeholder="Detalla el problema..." className="text-sm rounded-xl min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Área</Label>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {areas.map(a => <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Sub-área</Label>
                  <Select disabled={!selectedArea}>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {subAreas.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Prioridad</Label>
                  <Select>
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
                  <Select>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {users.filter(u => u.role === 'operario').map(u => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full rounded-xl text-sm font-normal" onClick={() => setOpenCreate(false)}>
                Crear ticket
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
        {users.filter(u => u.id !== currentUser.id).map(u => (
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
              filterByStatus(status).map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} onOpen={handleOpenTicket} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      <TicketDetailSheet
        ticket={selectedTicket}
        open={Boolean(selectedTicket)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedTicketId(null);
        }}
        onSave={handleSaveTicketUpdate}
      />
    </div>
  );
};

export default Tickets;
