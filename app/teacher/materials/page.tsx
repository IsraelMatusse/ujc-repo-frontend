'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Upload, Download, Eye, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

// Mock — substituir por hook real
const mockMaterials = [
  {
    id: '1',
    title: 'Ficha de Exercícios — Álgebra Linear',
    subject: 'Matemática II',
    type: 'Ficha',
    status: 'APPROVED',
    downloads: 47,
    createdAt: '10/03/2025',
  },
  {
    id: '2',
    title: 'Teste Modelo — Programação I',
    subject: 'Programação I',
    type: 'Teste',
    status: 'PENDING',
    downloads: 0,
    createdAt: '05/03/2025',
  },
  {
    id: '3',
    title: 'Apontamentos — Estruturas de Dados',
    subject: 'Estruturas de Dados',
    type: 'Apontamentos',
    status: 'APPROVED',
    downloads: 123,
    createdAt: '20/02/2025',
  },
  {
    id: '4',
    title: 'Exame de Recurso 2023 — Física I',
    subject: 'Física I',
    type: 'Exame',
    status: 'REJECTED',
    downloads: 0,
    createdAt: '10/02/2025',
  },
  {
    id: '5',
    title: 'Resumo — Sistemas Operativos',
    subject: 'Sistemas Operativos',
    type: 'Resumo',
    status: 'APPROVED',
    downloads: 89,
    createdAt: '01/02/2025',
  },
];

const statusConfig = {
  APPROVED: {
    label: 'Aprovado',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  PENDING: {
    label: 'Pendente',
    icon: Clock,
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
  REJECTED: {
    label: 'Rejeitado',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

export default function TeacherMaterialsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = mockMaterials.filter(m => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meus Materiais</h2>
          <p className="text-muted-foreground">Todos os materiais que submeteu ao repositório</p>
        </div>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" asChild>
          <Link href="/teacher/upload">
            <Upload className="h-4 w-4" />
            Novo Material
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Materiais</CardTitle>
          <CardDescription>Total de {mockMaterials.length} materiais submetidos</CardDescription>
          <div className="flex items-center gap-3 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou disciplina..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="APPROVED">Aprovados</SelectItem>
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="REJECTED">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => {
                const status = statusConfig[m.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium max-w-xs truncate">{m.title}</TableCell>
                    <TableCell>{m.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={status.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Download className="h-3 w-3 text-muted-foreground" />
                        {m.downloads}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/teacher/materials/${m.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={m.status === 'APPROVED'}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
