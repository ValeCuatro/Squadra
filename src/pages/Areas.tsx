import { useState } from 'react';
import { ChevronRight, Plus, ArrowLeft } from 'lucide-react';
import { areas as mockAreas, users, type Area } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Areas = () => {
  const [areaList] = useState(mockAreas);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [newSubAreaOpen, setNewSubAreaOpen] = useState(false);
  const [newAreaOpen, setNewAreaOpen] = useState(false);

  if (selectedArea) {
    return (
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-normal">{selectedArea.name}</h1>
              <button onClick={() => setSelectedArea(null)} className="p-1">
                <ArrowLeft size={16} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {selectedArea.subAreas.length} sub-áreas · {selectedArea.responsible.name}
            </p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-sm">
          <img src={selectedArea.image} alt={selectedArea.name} className="w-full h-40 object-cover" />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Sub-áreas</h2>
          <Sheet open={newSubAreaOpen} onOpenChange={setNewSubAreaOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs font-normal gap-1 h-7">
                <Plus size={12} /> Agregar
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-sm font-medium">Nueva sub-área</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Nombre</Label>
                  <Input placeholder="Nombre de la sub-área" className="text-sm rounded-xl" />
                </div>
                <Button className="w-full rounded-xl text-sm font-normal" onClick={() => setNewSubAreaOpen(false)}>
                  Crear sub-área
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="space-y-2">
          {selectedArea.subAreas.map((sub) => (
            <div key={sub.id} className="bg-card rounded-xl p-3.5 shadow-sm flex items-center justify-between">
              <span className="text-sm font-normal">{sub.name}</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-normal">Áreas</h1>
        <Sheet open={newAreaOpen} onOpenChange={setNewAreaOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="rounded-xl text-xs font-normal gap-1.5 h-8">
              <Plus size={14} /> Nueva
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-sm font-medium">Nueva área</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Nombre del área</Label>
                <Input placeholder="Ej. Salón de eventos" className="text-sm rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">URL de imagen</Label>
                <Input placeholder="https://..." className="text-sm rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-normal">Responsable</Label>
                <Select>
                  <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full rounded-xl text-sm font-normal" onClick={() => setNewAreaOpen(false)}>
                Crear área
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-3">
        {areaList.map((area) => (
          <div
            key={area.id}
            onClick={() => setSelectedArea(area)}
            className="bg-card rounded-xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
          >
            <img src={area.image} alt={area.name} className="w-full h-32 object-cover" />
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-normal">{area.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {area.subAreas.length} sub-áreas · {area.responsible.name}
                </p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Areas;
