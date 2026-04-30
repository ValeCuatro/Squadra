import { useState } from 'react';
import { ChevronRight, Plus, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
const Areas = () => {
  const queryClient = useQueryClient();
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [newSubAreaOpen, setNewSubAreaOpen] = useState(false);
  const [newAreaOpen, setNewAreaOpen] = useState(false);
  const { user } = useAuth();

  // Form State
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaImage, setNewAreaImage] = useState('');
  const [newAreaResponsible, setNewAreaResponsible] = useState('');
  const [newSubAreaName, setNewSubAreaName] = useState('');

  const { data: areaList = [], isLoading: isLoadingAreas } = useQuery<any[]>({
    queryKey: ['areas'],
    queryFn: () => fetch('/api/areas').then(r => r.json())
  });

  const { data: userList = [] } = useQuery<any[]>({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  });

  const createAreaMutation = useMutation({
    mutationFn: (newArea: any) => fetch('/api/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArea)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      setNewAreaOpen(false);
      setNewAreaName('');
      setNewAreaImage('');
      setNewAreaResponsible('');
    }
  });

  const createSubAreaMutation = useMutation({
    mutationFn: ({ areaId, subArea }: { areaId: string, subArea: any }) => fetch(`/api/areas/${areaId}/subareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subArea)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      setNewSubAreaOpen(false);
      setNewSubAreaName('');
    }
  });

  const handleCreateArea = () => {
    if (!newAreaName) return;
    createAreaMutation.mutate({
      name: newAreaName,
      image: newAreaImage || undefined,
      responsibleId: newAreaResponsible || undefined
    });
  };

  const handleCreateSubArea = () => {
    if (!newSubAreaName || !selectedAreaId) return;
    createSubAreaMutation.mutate({
      areaId: selectedAreaId,
      subArea: { name: newSubAreaName }
    });
  };

  const selectedArea = areaList.find((a: any) => a.id === selectedAreaId) || null;

  if (isLoadingAreas) {
    return <div className="px-4 py-5 text-sm text-muted-foreground">Cargando áreas...</div>;
  }

  if (selectedArea) {
    return (
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-normal">{selectedArea.name}</h1>
              <button onClick={() => setSelectedAreaId(null)} className="p-1">
                <ArrowLeft size={16} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {selectedArea.subAreas?.length || 0} sub-áreas {selectedArea.responsible ? `· ${selectedArea.responsible.name}` : ''}
            </p>
          </div>
        </div>

        {selectedArea.image && (
          <div className="rounded-xl overflow-hidden shadow-sm">
            <img src={selectedArea.image} alt={selectedArea.name} className="w-full h-40 object-cover" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Sub-áreas</h2>
          {user?.role === 'ADMIN' && (
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
                    <Input 
                      value={newSubAreaName} 
                      onChange={e => setNewSubAreaName(e.target.value)}
                      placeholder="Nombre de la sub-área" 
                      className="text-sm rounded-xl" 
                    />
                  </div>
                  <Button 
                    className="w-full rounded-xl text-sm font-normal" 
                    onClick={handleCreateSubArea}
                    disabled={createSubAreaMutation.isPending}
                  >
                    {createSubAreaMutation.isPending ? 'Creando...' : 'Crear sub-área'}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <div className="space-y-2">
          {selectedArea.subAreas?.map((sub: any) => (
            <div key={sub.id} className="bg-card rounded-xl p-3.5 shadow-sm flex items-center justify-between">
              <span className="text-sm font-normal">{sub.name}</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </div>
          ))}
          {(!selectedArea.subAreas || selectedArea.subAreas.length === 0) && (
            <p className="text-xs text-muted-foreground py-4 text-center">No hay sub-áreas</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-normal">Áreas</h1>
        {user?.role === 'ADMIN' && (
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
                  <Input 
                    value={newAreaName}
                    onChange={e => setNewAreaName(e.target.value)}
                    placeholder="Ej. Salón de eventos" 
                    className="text-sm rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">URL de imagen (Opcional)</Label>
                  <Input 
                    value={newAreaImage}
                    onChange={e => setNewAreaImage(e.target.value)}
                    placeholder="https://..." 
                    className="text-sm rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-normal">Responsable</Label>
                  <Select value={newAreaResponsible} onValueChange={setNewAreaResponsible}>
                    <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {userList.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full rounded-xl text-sm font-normal" 
                  onClick={handleCreateArea}
                  disabled={createAreaMutation.isPending}
                >
                  {createAreaMutation.isPending ? 'Creando...' : 'Crear área'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="space-y-3">
        {areaList.map((area: any) => (
          <div
            key={area.id}
            onClick={() => setSelectedAreaId(area.id)}
            className="bg-card rounded-xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
          >
            {area.image && (
              <img src={area.image} alt={area.name} className="w-full h-32 object-cover" />
            )}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-normal">{area.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {area.subAreas?.length || 0} sub-áreas {area.responsible ? `· ${area.responsible.name}` : ''}
                </p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </div>
        ))}
        {areaList.length === 0 && (
          <p className="text-xs text-muted-foreground py-8 text-center">Aún no hay áreas creadas.</p>
        )}
      </div>
    </div>
  );
};

export default Areas;
