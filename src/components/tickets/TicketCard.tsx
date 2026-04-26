import { ChevronRight } from 'lucide-react';
import type { Ticket } from '@/data/mock';
import { Badge } from '@/components/ui/badge';
import { priorityColors, statusConfig } from './ticket-config';

interface TicketCardProps {
  ticket: Ticket;
  onOpen: (ticket: Ticket) => void;
}

const TicketCard = ({ ticket, onOpen }: TicketCardProps) => {
  const cfg = statusConfig[ticket.status];

  return (
    <button
      type="button"
      onClick={() => onOpen(ticket)}
      className="w-full rounded-2xl bg-primary p-4 text-left text-primary-foreground shadow-sm transition-transform active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-normal">{ticket.title}</p>
          <p className="mt-0.5 text-[10px] text-primary-foreground/72">
            {ticket.area} → {ticket.subArea}
          </p>
        </div>
        <Badge className={`shrink-0 px-2 py-0.5 text-[10px] font-normal ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </Badge>
      </div>

      <p className="mt-2 line-clamp-2 text-xs text-primary-foreground/72">{ticket.description}</p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <cfg.icon size={12} className={cfg.color} />
          <span className="text-[10px] capitalize text-primary-foreground/72">
            {ticket.status.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/14">
            <span className="text-[8px] font-medium text-primary-foreground">
              {ticket.assignee.name.split(' ').map((name) => name[0]).join('')}
            </span>
          </div>
          <span className="text-[10px] text-primary-foreground/72">
            {ticket.assignee.name.split(' ')[0]}
          </span>
          <ChevronRight size={14} className="text-primary-foreground/56" />
        </div>
      </div>
    </button>
  );
};

export default TicketCard;