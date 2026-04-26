import { useState, useMemo } from 'react';
import { Plus, Droplets, Thermometer, FlaskConical, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { poolMeasurements, pools } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const INITIAL_COUNT = 5;
const PAGE_SIZE = 20;

const getPhColor = (ph: number) => {
  if (ph >= 7.2 && ph <= 7.6) return 'text-success';
  if (ph >= 7.0 && ph <= 7.8) return 'text-warning';
  return 'text-destructive';
};

const getChlorineColor = (cl: number) => {
  if (cl >= 1.0 && cl <= 1.5) return 'text-success';
  if (cl >= 0.8 && cl <= 2.0) return 'text-warning';
  return 'text-destructive';
};

const Pools = () => {
  const [selectedPool, setSelectedPool] = useState('p1');
  const [addOpen, setAddOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  const measurements = useMemo(() =>
    poolMeasurements
      .filter(m => m.poolId === selectedPool)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [selectedPool]
  );

  const filteredMeasurements = useMemo(() => {
    if (!dateFilter) return measurements;
    return measurements.filter(m => isSameDay(new Date(m.date), dateFilter));
  }, [measurements, dateFilter]);

  const displayedMeasurements = filteredMeasurements.slice(0, INITIAL_COUNT);

  const latest = measurements[0];

  const chartData = [...measurements].reverse().map(m => ({
    date: new Date(m.date).toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit' }),
    pH: m.ph,
    Cloro: m.chlorine,
  }));

  const handlePoolChange = (id: string) => {
    setSelectedPool(id);
    setDateFilter(undefined);
    setHistoryPage(1);
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-normal">Piscinas</h1>
        <Sheet open={addOpen} onOpenChange={setAddOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="rounded-xl text-xs font-normal gap-1.5 h-8">
              <Plus size={14} /> Medición
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-sm font-medium">Nueva medición</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Piscina</Label>
                <Select>
                  <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {pools.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">pH</Label>
                  <Input type="number" step="0.1" placeholder="7.2" className="text-sm rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Temp °C</Label>
                  <Input type="number" step="0.1" placeholder="26" className="text-sm rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Cloro</Label>
                  <Input type="number" step="0.1" placeholder="1.5" className="text-sm rounded-xl" />
                </div>
              </div>
              <Button className="w-full rounded-xl text-sm font-normal" onClick={() => setAddOpen(false)}>
                Registrar medición
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Pool Selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {pools.map(pool => (
          <button
            key={pool.id}
            onClick={() => handlePoolChange(pool.id)}
            className={`shrink-0 text-[10px] px-3 py-1.5 rounded-full transition-colors ${
              selectedPool === pool.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
            }`}
          >
            {pool.name}
          </button>
        ))}
      </div>

      {/* Latest Reading */}
      {latest && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 shadow-sm text-center">
            <FlaskConical size={16} className="mx-auto text-muted-foreground mb-1" strokeWidth={1.5} />
            <p className={`text-lg font-light ${getPhColor(latest.ph)}`}>{latest.ph}</p>
            <p className="text-[10px] text-muted-foreground">pH</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-sm text-center">
            <Thermometer size={16} className="mx-auto text-muted-foreground mb-1" strokeWidth={1.5} />
            <p className="text-lg font-light">{latest.temperature}°</p>
            <p className="text-[10px] text-muted-foreground">Temp</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-sm text-center">
            <Droplets size={16} className="mx-auto text-muted-foreground mb-1" strokeWidth={1.5} />
            <p className={`text-lg font-light ${getChlorineColor(latest.chlorine)}`}>{latest.chlorine}</p>
            <p className="text-[10px] text-muted-foreground">Cloro ppm</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground mb-3">Tendencia — últimos 7 días</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="pH" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Cloro" stroke="hsl(var(--accent))" strokeWidth={1.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Historial
            </h2>
            <button
              onClick={() => setCalendarOpen(true)}
              className={cn("text-muted-foreground", dateFilter && "text-primary")}
            >
              <CalendarIcon size={13} />
            </button>
            <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
              <DialogContent className="w-auto max-w-[340px] p-0">
                <DialogHeader className="px-4 pt-4">
                  <DialogTitle className="text-sm font-medium">Filtrar por fecha</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={(d) => {
                    setDateFilter(d);
                    setCalendarOpen(false);
                  }}
                  locale={es}
                  className={cn("p-3 pointer-events-auto")}
                />
                {dateFilter && (
                  <div className="px-3 pb-3">
                    <Button variant="ghost" size="sm" className="w-full text-xs h-7" onClick={() => { setDateFilter(undefined); setCalendarOpen(false); }}>
                      Limpiar filtro
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            {dateFilter && (
              <span className="text-[10px] text-primary">{format(dateFilter, 'dd/MM/yyyy')}</span>
            )}
          </div>

          <Sheet open={historyOpen} onOpenChange={(o) => { setHistoryOpen(o); if (o) setHistoryPage(1); }}>
            <SheetTrigger asChild>
              <button className="text-[10px] text-primary font-medium">Ver todo</button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-sm font-medium">Historial completo</SheetTitle>
              </SheetHeader>
              <div className="space-y-2 mt-4">
                {measurements.slice(0, historyPage * PAGE_SIZE).map((m) => (
                  <div key={m.id} className="bg-muted/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(m.date).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' · '}
                        {new Date(m.date).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={getPhColor(m.ph)}>pH {m.ph}</span>
                      <span>{m.temperature}°C</span>
                      <span className={getChlorineColor(m.chlorine)}>Cl {m.chlorine} ppm</span>
                    </div>
                    {m.chemicals.length > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-border">
                        {m.chemicals.map((c, ci) => (
                          <p key={ci} className="text-[10px] text-muted-foreground">
                            + {c.quantity} {c.unit} de {c.product}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {historyPage * PAGE_SIZE < measurements.length && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-muted-foreground">
                      {Math.min(historyPage * PAGE_SIZE, measurements.length)} de {measurements.length}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => setHistoryPage(p => p + 1)}>
                      Cargar más <ChevronRight size={12} />
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="space-y-2">
          {displayedMeasurements.map((m) => (
            <div key={m.id} className="bg-card rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(m.date).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {' · '}
                  {new Date(m.date).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className={getPhColor(m.ph)}>pH {m.ph}</span>
                <span>{m.temperature}°C</span>
                <span className={getChlorineColor(m.chlorine)}>Cl {m.chlorine} ppm</span>
              </div>
              {m.chemicals.length > 0 && (
                <div className="mt-1.5 pt-1.5 border-t border-border">
                  {m.chemicals.map((c, ci) => (
                    <p key={ci} className="text-[10px] text-muted-foreground">
                      + {c.quantity} {c.unit} de {c.product}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
          {displayedMeasurements.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">Sin mediciones para esta fecha</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pools;
