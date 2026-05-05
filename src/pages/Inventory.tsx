import { useState } from 'react';
import { AlertTriangle, Plus, Package, Minus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser } from '@/data/mock';

const Inventory = () => {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery<any[]>({
    queryKey: ['inventory'],
    queryFn: () => fetch('/api/inventory').then(r => r.json())
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ['inventory-transactions'],
    queryFn: () => fetch('/api/inventory/transactions').then(r => r.json())
  });

  const categories = [...new Set(items.map((i: any) => i.category))];

  const [filterCat, setFilterCat] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT'>('IN');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({ name: '', category: '', minStock: '0', unit: 'u' });

  const filtered = filterCat === 'all' ? items : items.filter((i: any) => i.category === filterCat);
  const lowStockCount = items.filter((i: any) => i.currentStock <= i.minStock).length;

  const transactionMutation = useMutation({
    mutationFn: (data: any) => fetch('/api/inventory/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      setAddOpen(false);
      setSelectedItem('');
      setQuantity('');
    }
  });

  const createItemMutation = useMutation({
    mutationFn: (data: any) => fetch('/api/inventory/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setNewItemOpen(false);
      setNewItemData({ name: '', category: '', minStock: '0', unit: 'u' });
    }
  });

  const handleTransaction = () => {
    if (!selectedItem || !quantity || isNaN(Number(quantity))) return;
    transactionMutation.mutate({
      itemId: selectedItem,
      userId: currentUser.id,
      type: transactionType,
      quantity: Number(quantity)
    });
  };

  const handleCreateItem = () => {
    if (!newItemData.name || !newItemData.category) return;
    createItemMutation.mutate({
      ...newItemData,
      currentStock: 0
    });
  };

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
        <div className="flex gap-2">
          <Sheet open={addOpen && transactionType === 'OUT'} onOpenChange={(open) => {
            setTransactionType('OUT');
            setAddOpen(open);
          }}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl text-xs font-normal gap-1.5 h-8">
                <Minus size={14} /> Consumo
              </Button>
            </SheetTrigger>
          </Sheet>
          <Sheet open={addOpen && transactionType === 'IN'} onOpenChange={(open) => {
            setTransactionType('IN');
            setAddOpen(open);
          }}>
            <SheetTrigger asChild>
              <Button size="sm" className="rounded-xl text-xs font-normal gap-1.5 h-8">
                <Plus size={14} /> Entrada
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-sm font-medium">Registrar {transactionType === 'IN' ? 'Entrada' : 'Consumo'}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Producto</Label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {items.map((i: any) => <SelectItem key={i.id} value={i.id}>{i.name} (Stock: {i.currentStock})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Cantidad</Label>
                  <Input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" className="text-sm rounded-xl" />
                </div>
                <Button 
                  className="w-full rounded-xl text-sm font-normal" 
                  onClick={handleTransaction}
                  disabled={transactionMutation.isPending}
                >
                  Registrar
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet open={newItemOpen} onOpenChange={setNewItemOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl text-xs font-normal gap-1.5 h-8">
                Nuevo Prod
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-sm font-medium">Crear Producto</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Nombre</Label>
                  <Input value={newItemData.name} onChange={e => setNewItemData({...newItemData, name: e.target.value})} placeholder="Ej: Jabón líquido" className="text-sm rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Categoría</Label>
                  <Input value={newItemData.category} onChange={e => setNewItemData({...newItemData, category: e.target.value})} placeholder="Ej: Limpieza" className="text-sm rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-normal">Mínimo Stock</Label>
                    <Input type="number" value={newItemData.minStock} onChange={e => setNewItemData({...newItemData, minStock: e.target.value})} className="text-sm rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-normal">Unidad</Label>
                    <Input value={newItemData.unit} onChange={e => setNewItemData({...newItemData, unit: e.target.value})} placeholder="u, kg, L" className="text-sm rounded-xl" />
                  </div>
                </div>
                <Button 
                  className="w-full rounded-xl text-sm font-normal" 
                  onClick={handleCreateItem}
                  disabled={createItemMutation.isPending}
                >
                  Crear
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="w-full bg-card rounded-xl h-9">
          <TabsTrigger value="stock" className="flex-1 text-xs font-normal rounded-lg data-[state=active]:shadow-sm">Stock Actual</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 text-xs font-normal rounded-lg data-[state=active]:shadow-sm">Historial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock" className="space-y-4 mt-4">
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
      </TabsContent>
      
      <TabsContent value="history" className="mt-4 space-y-2">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">No hay registros</div>
        ) : (
          transactions.map((tx: any) => (
            <div key={tx.id} className="bg-card rounded-xl p-3.5 shadow-sm flex items-start gap-3">
              <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                {tx.type === 'IN' ? <Plus size={14} /> : <Minus size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal truncate">
                  {tx.quantity}x {tx.item?.name}
                </p>
                <div className="text-[10px] text-muted-foreground mt-0.5 space-y-0.5">
                  <p>Por: {tx.user?.name}</p>
                  {tx.ticket && <p>Ticket: {tx.ticket.title}</p>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-muted-foreground">
                  {new Date(tx.date).toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit' })}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(tx.date).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
