import { Ticket as TicketIcon, AlertTriangle, CheckCircle2, Clock, Activity, CloudSun, ArrowRight, BarChart3, TrendingUp, PackageMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { currentUser, recentActivity } from '@/data/mock';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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

const PIE_COLORS = ['#ffc107', '#007bff', '#28a745'];

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => fetch('/api/dashboard/stats').then(r => r.json()),
    refetchInterval: 10000 // Refetch every 10s
  });

  const { data: tickets = [] } = useQuery<any[]>({
    queryKey: ['tickets'],
    queryFn: () => fetch('/api/tickets').then(r => r.json())
  });

  const urgentTasks = tickets.filter(
    (t: any) => t.status !== 'resuelto' && (t.priority === 'urgente' || t.priority === 'alta')
  );

  const today = new Date().toLocaleDateString('es-UY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  if (isLoading || !stats) {
    return (
      <div className="px-4 py-5 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <Activity className="text-primary mb-2 animate-bounce" size={32} />
          <p className="text-sm text-muted-foreground">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  const { kpis, inventoryAlerts, consumptionTrend, taskStatusDistribution } = stats;

  return (
    <div className="px-4 py-5 space-y-6 pb-24">
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
          { label: 'Pendientes', value: kpis.pending, icon: Clock, route: '/tickets', state: { statusFilter: 'pendiente' }, bgPos: '0% 0%' },
          { label: 'En proceso', value: kpis.inProgress, icon: Activity, route: '/tickets', state: { statusFilter: 'en_proceso' }, bgPos: '100% 0%' },
          { label: 'Resueltos', value: kpis.resolved, icon: CheckCircle2, route: '/tickets', state: { statusFilter: 'resuelto' }, bgPos: '0% 100%' },
          { label: 'Stock bajo', value: inventoryAlerts.length, icon: AlertTriangle, route: '/inventario', bgPos: '100% 100%' },
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

      {/* Admin KPIs Area */}
      <div>
        <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-3 flex items-center gap-1">
          <BarChart3 size={14} /> Salud Operativa (KPIs)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
            <p className="text-[10px] text-muted-foreground uppercase">Tasa de Finalización</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-light text-foreground">{kpis.completionRate}%</span>
              {kpis.completionRate >= 50 ? (
                <TrendingUp size={14} className="text-success mb-1" />
              ) : (
                <TrendingUp size={14} className="text-warning mb-1 rotate-180" />
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-1 mt-2">
              <div className="bg-primary h-1 rounded-full" style={{ width: `${kpis.completionRate}%` }} />
            </div>
          </div>

          <div className={`rounded-xl p-3 shadow-sm border ${kpis.mttrHours > 48 ? 'bg-destructive/10 border-destructive/30' : 'bg-card border-border'}`}>
            <p className="text-[10px] text-muted-foreground uppercase">MTTR Promedio</p>
            <div className="flex items-end gap-2 mt-1">
              <span className={`text-2xl font-light ${kpis.mttrHours > 48 ? 'text-destructive font-medium' : 'text-foreground'}`}>
                {kpis.mttrHours}h
              </span>
              {kpis.mttrHours > 48 && <AlertTriangle size={14} className="text-destructive mb-1" />}
            </div>
            <p className="text-[9px] text-muted-foreground mt-2">
              {kpis.mttrHours > 48 ? 'Tiempo de resolución crítico' : 'Dentro de los parámetros'}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Charts: Inventory Consumption & Ticket Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ticket Distribution */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-3">
          <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-2">Distribución de Tareas</h2>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 mt-1">
            {taskStatusDistribution.map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                <span className="text-[10px] text-muted-foreground">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Trend */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-3">
          <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-2">Tendencia de Consumo (Insumos)</h2>
          {consumptionTrend.length > 0 ? (
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumptionTrend}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 9 }} 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')} 
                    stroke="#888888" 
                  />
                  <YAxis tick={{ fontSize: 9 }} stroke="#888888" width={25} />
                  <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="quantity" name="Unidades Consumidas" stroke="#004b93" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">
               No hay suficientes datos de consumo
             </div>
          )}
        </div>
      </div>

      {/* Depletion Estimation Alerts */}
      {inventoryAlerts.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-3 flex items-center gap-1 text-destructive">
            <PackageMinus size={14} /> Alertas de Quiebre de Stock Estimado
          </h2>
          <div className="space-y-2">
            {inventoryAlerts.map((alert: any) => (
              <div key={alert.id} className="bg-card rounded-xl p-3 shadow-sm border-l-2 border-destructive flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{alert.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Stock actual: <strong className="text-foreground">{alert.currentStock} {alert.unit}</strong> (Min: {alert.minStock})
                  </p>
                </div>
                <div className="text-right">
                  {alert.estimatedDaysRemaining !== null ? (
                    <>
                      <p className="text-xs font-semibold text-destructive">
                        Quedan ~{alert.estimatedDaysRemaining} días
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        Se usan {alert.dailyVelocity} {alert.unit}/día
                      </p>
                    </>
                  ) : (
                    <p className="text-xs font-semibold text-warning">Poco uso reciente</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Tasks (Legacy MVP behavior) */}
      {urgentTasks.length > 0 && (
        <div className="pt-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Tickets Críticos / Urgentes
            </h2>
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="inline-flex items-center gap-1 text-[10px] text-primary"
            >
              Ver tickets
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {urgentTasks.map((task: any) => (
              <button
                type="button"
                key={task.id}
                onClick={() => navigate('/tickets', { state: { openTicketId: task.id, statusFilter: task.status } })}
                className="w-full bg-card rounded-xl p-3 shadow-sm flex items-center gap-3 text-left"
              >
                {statusIcons[task.status === 'pendiente' ? 'pendiente' : task.status === 'en_proceso' ? 'en_proceso' : 'resuelto']}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-normal truncate">{task.title}</p>
                  <p className="text-[10px] text-muted-foreground">{task.subArea?.name || task.subArea || 'Sin sub-área'}</p>
                </div>
                <Badge className={`text-[10px] px-2 py-0.5 font-normal ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
