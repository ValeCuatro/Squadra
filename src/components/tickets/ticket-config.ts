import { Activity, CheckCircle2, Clock, type LucideIcon } from 'lucide-react';
import type { Ticket } from '@/data/mock';

type TicketStatusMeta = {
  icon: LucideIcon;
  color: string;
  label: string;
};

export const priorityColors: Record<Ticket['priority'], string> = {
  urgente: 'bg-destructive/90 text-destructive-foreground',
  alta: 'bg-primary-foreground/16 text-primary-foreground',
  media: 'bg-background/14 text-primary-foreground',
  baja: 'border border-primary-foreground/12 bg-background/8 text-primary-foreground/80',
};

export const statusConfig: Record<Ticket['status'], TicketStatusMeta> = {
  pendiente: { icon: Clock, color: 'text-primary-foreground/80', label: 'Pendientes' },
  en_proceso: { icon: Activity, color: 'text-primary-foreground/80', label: 'En proceso' },
  resuelto: { icon: CheckCircle2, color: 'text-primary-foreground/80', label: 'Resueltos' },
};

export const ticketStatusOptions: Ticket['status'][] = ['pendiente', 'en_proceso', 'resuelto'];