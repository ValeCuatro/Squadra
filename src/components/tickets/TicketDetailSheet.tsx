import { useEffect, useState } from 'react';
import type { Ticket } from '@/data/mock';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { currentUser } from '@/data/mock';
import { priorityColors, statusConfig, ticketStatusOptions } from './ticket-config';

interface TicketDetailSheetProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ticketId: string, nextStatus: Ticket['status'], note: string) => void;
}

const TicketDetailSheet = ({ ticket, open, onOpenChange, onSave }: TicketDetailSheetProps) => {
  const queryClient = useQueryClient();
  const [nextStatus, setNextStatus] = useState<Ticket['status']>('pendiente');
  const [note, setNote] = useState('');
  
  // Inventory usage state
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  // Equipment usage state
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');

  useEffect(() => {
    if (!ticket) return;
    setNextStatus(ticket.status);
    setNote('');
  }, [ticket]);

  const handleSave = () => {
    if (!ticket) return;
    onSave(ticket.id, nextStatus, note);
    setNote('');
  };

  const { data: inventoryItems = [] } = useQuery<any[]>({
    queryKey: ['inventory'],
    queryFn: () => fetch('/api/inventory').then(r => r.json())
  });

  const transactionMutation = useMutation({
    mutationFn: (data: any) => fetch('/api/inventory/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setSelectedItem('');
      setQuantity('');
    }
  });

  const { data: equipmentList = [] } = useQuery<any[]>({
    queryKey: ['equipment'],
    queryFn: () => fetch('/api/equipment').then(r => r.json())
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: (data: any) => fetch(`/api/equipment/${data.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setSelectedEquipment('');
    }
  });

  const handleRegisterConsumption = () => {
    if (!ticket || !selectedItem || !quantity || isNaN(Number(quantity))) return;
    transactionMutation.mutate({
      itemId: selectedItem,
      userId: currentUser.id,
      ticketId: ticket.id,
      type: 'OUT',
      quantity: Number(quantity)
    });
  };

  const handleTakeEquipment = () => {
    if (!ticket || !selectedEquipment) return;
    updateEquipmentMutation.mutate({
      id: selectedEquipment,
      status: 'IN_USE',
      ticketId: ticket.id,
      assigneeId: currentUser.id,
      action: 'CHECK_OUT'
    });
  };

  const handleReturnEquipment = (equipmentId: string) => {
    updateEquipmentMutation.mutate({
      id: equipmentId,
      status: 'AVAILABLE',
      ticketId: null,
      assigneeId: null,
      action: 'RETURN'
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-sm font-medium">Detalle de tarea</SheetTitle>
        </SheetHeader>

        {ticket ? (
          <div className="mt-4 space-y-4">
            <div className="space-y-3 rounded-3xl bg-primary p-4 text-primary-foreground shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-normal">{ticket.title}</p>
                  <p className="mt-0.5 text-[10px] text-primary-foreground/72">
                    {ticket.area?.name || ticket.area} {ticket.subArea ? `· ${ticket.subArea.name || ticket.subArea}` : ''}
                  </p>
                </div>
                <Badge className={`px-2 py-0.5 text-[10px] font-normal ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </Badge>
              </div>

              <p className="text-xs leading-relaxed text-primary-foreground/80">{ticket.description}</p>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-primary-foreground/72">
                <div className="rounded-2xl bg-primary-foreground/10 p-3">
                  <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-primary-foreground/56">Asignado a</p>
                  <p className="text-xs text-primary-foreground">{ticket.assignee ? ticket.assignee.name : 'Sin asignar'}</p>
                </div>
                <div className="rounded-2xl bg-primary-foreground/10 p-3">
                  <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-primary-foreground/56">Actualizado</p>
                  <p className="text-xs text-primary-foreground">
                    {new Date(ticket.updatedAt).toLocaleString('es-UY', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl bg-card p-4 shadow-sm">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Estado</Label>
                <Select value={nextStatus} onValueChange={(value) => setNextStatus(value as Ticket['status'])}>
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketStatusOptions.map((status) => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Registro</Label>
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Dejá una nota breve del cambio o avance"
                  className="min-h-[88px] rounded-xl text-sm"
                />
              </div>

              <Button
                className="w-full rounded-xl text-sm font-normal"
                onClick={handleSave}
                disabled={nextStatus === ticket.status && !note.trim()}
              >
                Guardar actualización
              </Button>
            </div>

            {/* Material Consumption Section */}
            <div className="space-y-4 rounded-3xl bg-card p-4 shadow-sm">
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Consumo de Materiales</h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Producto</Label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger className="rounded-xl text-sm">
                      <SelectValue placeholder="Seleccionar material usado" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((i: any) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name} (Stock: {i.currentStock} {i.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Cantidad</Label>
                  <Input 
                    type="number" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)} 
                    placeholder="0" 
                    className="text-sm rounded-xl" 
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl text-sm font-normal"
                  onClick={handleRegisterConsumption}
                  disabled={transactionMutation.isPending || !selectedItem || !quantity}
                >
                  {transactionMutation.isPending ? 'Registrando...' : 'Registrar Consumo'}
                </Button>
              </div>
            </div>

            {/* Uso de Herramientas Section */}
            <div className="space-y-4 rounded-3xl bg-card p-4 shadow-sm">
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Uso de Herramientas</h3>
              
              {equipmentList.filter((eq: any) => eq.ticketId === ticket.id).length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] text-muted-foreground uppercase">Herramientas en uso</p>
                  {equipmentList.filter((eq: any) => eq.ticketId === ticket.id).map((eq: any) => (
                    <div key={eq.id} className="flex items-center justify-between bg-background p-2 rounded-xl">
                      <span className="text-xs font-medium">{eq.name}</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[10px] h-6 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleReturnEquipment(eq.id)}
                        disabled={updateEquipmentMutation.isPending}
                      >
                        Devolver
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Tomar herramienta</Label>
                  <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                    <SelectTrigger className="rounded-xl text-sm">
                      <SelectValue placeholder="Seleccionar herramienta libre" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentList.filter((eq: any) => eq.status === 'AVAILABLE' || (eq.status === 'RESERVED' && eq.ticketId === ticket.id)).map((eq: any) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name} {eq.status === 'RESERVED' ? '(Reservado)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl text-sm font-normal"
                  onClick={handleTakeEquipment}
                  disabled={updateEquipmentMutation.isPending || !selectedEquipment}
                >
                  {updateEquipmentMutation.isPending ? 'Procesando...' : 'Tomar para este ticket'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Historial</h3>
                <span className="text-[10px] text-muted-foreground">{ticket.comments.length} registros</span>
              </div>

              <div className="space-y-2">
                {ticket.comments.length === 0 ? (
                  <div className="rounded-2xl bg-card px-4 py-5 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground">Todavía no hay registros en esta tarea.</p>
                  </div>
                ) : (
                  [...ticket.comments].reverse().map((comment, index) => {
                    const isLatest = index === 0;

                    return (
                      <div key={`${comment.user}-${comment.date}-${index}`} className="rounded-2xl bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-normal text-foreground">{comment.user}</p>
                          {isLatest ? (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-primary">
                              Último
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{comment.text}</p>
                        <p className="mt-2 text-[10px] text-muted-foreground">
                          {new Date(comment.date).toLocaleString('es-UY', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default TicketDetailSheet;