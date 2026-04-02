'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Upload,
  CheckSquare,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

// Simulação — substituir pelos hooks reais quando disponíveis
const mockStats = {
  totalMaterials: 18,
  pendingReview: 3,
  approved: 14,
  totalDownloads: 342,
};

const mockRecentMaterials = [
  {
    id: '1',
    title: 'Ficha de Exercícios — Álgebra Linear',
    subject: 'Matemática II',
    status: 'APPROVED',
    downloads: 47,
    uploadedAt: 'há 2 dias',
  },
  {
    id: '2',
    title: 'Teste Modelo — Programação I',
    subject: 'Programação I',
    status: 'PENDING',
    downloads: 0,
    uploadedAt: 'há 5 dias',
  },
  {
    id: '3',
    title: 'Apontamentos — Estruturas de Dados',
    subject: 'Estruturas de Dados',
    status: 'APPROVED',
    downloads: 123,
    uploadedAt: 'há 2 semanas',
  },
  {
    id: '4',
    title: 'Exame de Recurso 2023 — Física I',
    subject: 'Física I',
    status: 'REJECTED',
    downloads: 0,
    uploadedAt: 'há 3 semanas',
  },
];

const mockPendingReviews = [
  {
    id: 'r1',
    title: 'Exercícios de Cálculo — Parte 2',
    submittedBy: 'Ana Machava',
    subject: 'Matemática I',
    submittedAt: 'há 1 dia',
  },
  {
    id: 'r2',
    title: 'Resumo — Redes de Computadores',
    submittedBy: 'Carlos Nhantumbo',
    subject: 'Redes',
    submittedAt: 'há 3 dias',
  },
  {
    id: 'r3',
    title: 'Ficha Prática — SQL Avançado',
    submittedBy: 'Fátima Sitoe',
    subject: 'Bases de Dados',
    submittedAt: 'há 4 dias',
  },
];

const statusConfig = {
  APPROVED: {
    label: 'Aprovado',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  PENDING: {
    label: 'Pendente',
    variant: 'secondary' as const,
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
  REJECTED: {
    label: 'Rejeitado',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Olá, {user?.fullName?.split(' ')[0]} 👋
        </h2>
        <p className="text-muted-foreground">
          Bem-vindo à sua área docente. Aqui gere os seus materiais e avaliações.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais Submetidos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">ao longo do tempo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Para Avaliar</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingReview}</div>
            <p className="text-xs text-orange-600 font-medium">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.approved}</div>
            <p className="text-xs text-green-600 font-medium">
              {Math.round((mockStats.approved / mockStats.totalMaterials) * 100)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">nos seus materiais</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Meus materiais recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Materiais Recentes</CardTitle>
              <CardDescription>Os seus últimos materiais submetidos</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/teacher/materials">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecentMaterials.map(m => {
              const status = statusConfig[m.status as keyof typeof statusConfig];
              return (
                <div
                  key={m.id}
                  className="flex items-start justify-between gap-3 py-2 border-b last:border-0"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {m.status === 'APPROVED' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {m.status === 'PENDING' && <Clock className="h-4 w-4 text-orange-500" />}
                      {m.status === 'REJECTED' && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{m.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.subject} · {m.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge className={status.className}>{status.label}</Badge>
                    {m.downloads > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Download className="h-3 w-3" /> {m.downloads}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Materiais para avaliar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Para Avaliar</CardTitle>
              <CardDescription>
                Submissões de estudantes que aguardam a sua avaliação
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/teacher/review">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPendingReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nenhuma submissão pendente. 🎉
              </p>
            ) : (
              mockPendingReviews.map(r => (
                <div
                  key={r.id}
                  className="flex items-start justify-between gap-3 py-2 border-b last:border-0"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-md mt-0.5 shrink-0">
                      <FileText className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.submittedBy} · {r.subject} · {r.submittedAt}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0" asChild>
                    <Link href={`/teacher/review/${r.id}`}>
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Avaliar
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Tarefas frequentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex-col gap-2 bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/teacher/upload">
                <Upload className="h-6 w-6" />
                <span>Submeter Material</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/teacher/review">
                <CheckSquare className="h-6 w-6" />
                <span>Avaliar Submissões</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/teacher/materials">
                <TrendingUp className="h-6 w-6" />
                <span>Ver Estatísticas</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
