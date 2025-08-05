import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select as CustomSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../ui/select';
import { Filter, Search, UserPlus } from 'lucide-react';

interface UsuariosControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  onCreateUser: () => void;
}

export function UsuariosControls({
  searchTerm,
  setSearchTerm,
  selectedLevel,
  setSelectedLevel,
  onCreateUser
}: UsuariosControlsProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros e Ações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <div className="relative ml-4 mb-2">
              <Label htmlFor="search" className="text-slate-300">Buscar usuários</Label>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 ml-4" />
              <Input
                id="search"
                placeholder="Nome, email, cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ml-4"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48 ml-4">
            <div className="mb-2">
              <Label className="text-slate-300">Filtrar por nível</Label>
            </div>
            <CustomSelect value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Todos os níveis" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">Todos os níveis</SelectItem>
                <SelectItem value="adm" className="text-white">Administrador</SelectItem>
                <SelectItem value="vendas" className="text-white">Vendas</SelectItem>
                <SelectItem value="financeiro" className="text-white">Financeiro</SelectItem>
                <SelectItem value="logistica" className="text-white">Logística</SelectItem>
              </SelectContent>
            </CustomSelect>
          </div>
          
          <div className="mr-4">
            <Button 
              onClick={onCreateUser} 
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
