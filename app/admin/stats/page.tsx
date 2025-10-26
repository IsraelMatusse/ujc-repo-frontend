'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/use-admin';
import { FileText, Users, Download, Upload, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatsPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
          <p className="text-muted-foreground">Análise detalhada do sistema</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Materiais',
      value: stats?.totalMaterials || 0,
      growth: stats?.materialsGrowth || 0,
      icon: FileText,
    },
    {
      title: 'Usuários Ativos',
      value: stats?.totalUsers || 0,
      growth: stats?.usersGrowth || 0,
      icon: Users,
    },
    {
      title: 'Total de Downloads',
      value: stats?.totalDownloads || 0,
      growth: stats?.downloadsGrowth || 0,
      icon: Download,
    },
    {
      title: 'Total de Uploads',
      value: stats?.totalUploads || 0,
      growth: stats?.uploadsGrowth || 0,
      icon: Upload,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
        <p className="text-muted-foreground">Análise detalhada do sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(stat => {
          const Icon = stat.icon;
          const isPositive = stat.growth >= 0;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                    {isPositive ? '+' : ''}
                    {stat.growth}%
                  </span>
                  <span>desde o mês passado</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Materiais por Tipo</CardTitle>
            <CardDescription>Distribuição de materiais no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fichas</span>
                <span className="text-sm font-medium">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Testes</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Exercícios</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Slides</span>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Outros</span>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Mensal</CardTitle>
            <CardDescription>Uploads e downloads por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Janeiro</span>
                <div className="flex gap-2">
                  <span className="text-sm text-blue-600">↑ 45</span>
                  <span className="text-sm text-green-600">↓ 234</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fevereiro</span>
                <div className="flex gap-2">
                  <span className="text-sm text-blue-600">↑ 52</span>
                  <span className="text-sm text-green-600">↓ 289</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Março</span>
                <div className="flex gap-2">
                  <span className="text-sm text-blue-600">↑ 38</span>
                  <span className="text-sm text-green-600">↓ 312</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
