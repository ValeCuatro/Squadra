import { useState } from 'react';
import { AlertTriangle, Plus, Package } from 'lucide-react';
import { inventory as mockInventory } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [...new Set(mockInventory.map(i => i.category))];

const Inventory = () => {
  const [items] = useState(mockInventory);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);

  const filtered = filterCat === 'all' ? items : items.filter(i => i.category === filterCat);
  const lowStockCount = items.filter(i => i.currentStock <= i.minStock).length;

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-normal">Inventario</h1>
          {lowStockCount > 0 && (
            <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5">
              <AlertTriangle size={10} /> {lowStockCount} productos bajo mínimo
            </p>
          )}
        </div>
        <Sheet open={addOpen} onOpenChange={setAddOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="rounded-xl text-xs font-normal gap-1.5 h-8">
              <Plus size={14} /> Entrada
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle className="text-sm font-medium">Registrar entrada</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Producto</Label>
                <Select>
                  <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {items.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Cantidad</Label>
                <Input type="number" placeholder="0" className="text-sm rounded-xl" />
              </div>
              <Button className="w-full rounded-xl text-sm font-normal" onClick={() => setAddOpen(false)}>
                Registrar
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setFilterCat('all')}
          className={`shrink-0 text-[10px] px-3 py-1.5 rounded-full transition-colors ${
            filterCat === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
          }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`shrink-0 text-[10px] px-3 py-1.5 rounded-full transition-colors ${
              filterCat === cat ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const isLow = item.currentStock <= item.minStock;
          return (
            <div
              key={item.id}
              className={`bg-card rounded-xl p-3.5 shadow-sm flex items-center gap-3 ${isLow ? 'ring-1 ring-destructive/20' : ''}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isLow ? 'bg-destructive/10' : 'bg-primary/5'}`}>
                {isLow ? (
                  <AlertTriangle size={16} className="text-destructive" strokeWidth={1.5} />
                ) : (
                  <Package size={16} className="text-primary" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-normal ${isLow ? 'text-destructive' : ''}`}>
                  {item.currentStock} <span className="text-[10px] text-muted-foreground">{item.unit}</span>
                </p>
                <p className="text-[10px] text-muted-foreground">mín. {item.minStock}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
