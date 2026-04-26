import { useEffect, useState } from 'react';
import type { Ticket } from '@/data/mock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { priorityColors, statusConfig, ticketStatusOptions } from './ticket-config';

interface TicketDetailSheetProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ticketId: string, nextStatus: Ticket['status'], note: string) => void;
}

const TicketDetailSheet = ({ ticket, open, onOpenChange, onSave }: TicketDetailSheetProps) => {
  const [nextStatus, setNextStatus] = useState<Ticket['status']>('pendiente');
  const [note, setNote] = useState('');

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
                    {ticket.area} · {ticket.subArea}
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
                  <p className="text-xs text-primary-foreground">{ticket.assignee.name}</p>
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