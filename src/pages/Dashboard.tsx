import { Ticket, AlertTriangle, CheckCircle2, Clock, Activity, CloudSun, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tickets, recentActivity, currentUser, inventory } from '@/data/mock';
import { Badge } from '@/components/ui/badge';

const priorityColors: Record<string, string> = {
  urgente: 'bg-destructive text-destructive-foreground',
  alta: 'bg-warning text-warning-foreground',
  media: 'bg-primary/10 text-primary',
  baja: 'bg-muted text-muted-foreground',
};

const statusIcons: Record<string, React.ReactNode> = {
  pendiente: <Clock size={14} className="text-warning" />,
  en_proceso: <Activity size={14} className="text-primary" />,
  resuelto: <CheckCircle2 size={14} className="text-success" />,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const pending = tickets.filter(t => t.status === 'pendiente').length;
  const inProgress = tickets.filter(t => t.status === 'en_proceso').length;
  const resolved = tickets.filter(t => t.status === 'resuelto').length;
  const lowStock = inventory.filter(i => i.currentStock <= i.minStock).length;

  const urgentTasks = tickets.filter(
    t => t.status !== 'resuelto' && (t.priority === 'urgente' || t.priority === 'alta')
  );

  const today = new Date().toLocaleDateString('es-UY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Greeting + Weather */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground capitalize">{today}</p>
          <h1 className="text-lg font-normal mt-0.5">
            Hola, <span className="font-medium">{currentUser.name.split(' ')[0]}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-card rounded-xl px-3 py-2 shadow-sm">
          <CloudSun size={18} className="text-warning" strokeWidth={1.5} />
          <div className="text-right">
            <p className="text-sm font-light leading-tight">24°</p>
            <p className="text-[9px] text-muted-foreground">Montevideo</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Pendientes', value: pending, icon: Clock, route: '/tickets', state: { statusFilter: 'pendiente' }, bgPos: '0% 0%' },
          { label: 'En proceso', value: inProgress, icon: Activity, route: '/tickets', state: { statusFilter: 'en_proceso' }, bgPos: '100% 0%' },
          { label: 'Resueltos', value: resolved, icon: CheckCircle2, route: '/tickets', state: { statusFilter: 'resuelto' }, bgPos: '0% 100%' },
          { label: 'Stock bajo', value: lowStock, icon: AlertTriangle, route: '/inventario', bgPos: '100% 100%' },
        ].map((card) => (
          <button
            type="button"
            key={card.label}
            onClick={() => navigate(card.route, card.state ? { state: card.state } : undefined)}
            className="bg-primary rounded-2xl p-3 shadow-md relative overflow-hidden text-left transition-transform active:scale-[0.97]"
          >
            <div
              className="absolute inset-0 opacity-[0.25]"
              style={{
                backgroundImage: 'url(https://imgs.elpais.com.uy/dims4/default/d9c6817/2147483647/strip/true/crop/993x683+15+0/resize/1440x990!/format/webp/quality/90/?url=https%3A%2F%2Fel-pais-uruguay-production-web.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fuploads%2F2020%2F05%2F02%2F5eadfa9cd348d.jpeg)',
                backgroundSize: '200% 200%',
                backgroundPosition: card.bgPos,
              }}
            />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-2xl font-light text-white leading-none">{card.value}</p>
                <p className="text-[10px] text-white/60 font-light mt-1">{card.label}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-0.5">
                  <span className="text-[9px] text-white/50 font-light">Ver</span>
                  <ArrowRight size={8} className="text-white/40" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <card.icon size={14} className="text-white/70" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Tareas urgentes
            </h2>
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="inline-flex items-center gap-1 text-[10px] text-primary"
            >
              Ver tareas
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {urgentTasks.map((task) => (
              <button
                type="button"
                key={task.id}
                onClick={() => navigate('/tickets', { state: { openTicketId: task.id, statusFilter: task.status } })}
                className="w-full bg-card rounded-xl p-3 shadow-sm flex items-center gap-3 text-left"
              >
                {statusIcons[task.status]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-normal truncate">{task.title}</p>
                  <p className="text-[10px] text-muted-foreground">{task.subArea}</p>
                </div>
                <Badge className={`text-[10px] px-2 py-0.5 font-normal ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-3">
          Actividad reciente
        </h2>
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          {recentActivity.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-normal">
                  <span className="text-muted-foreground">{act.action}</span>{' '}
                  <span className="font-medium">{act.target}</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {act.user} · {new Date(act.date).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
