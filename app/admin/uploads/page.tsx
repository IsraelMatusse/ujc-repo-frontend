'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminUploads } from '@/hooks/use-admin';
import { CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function UploadsPage() {
  const { data: uploads, isLoading } = useAdminUploads();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Uploads</h2>
          <p className="text-muted-foreground">Histórico de uploads do sistema</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Uploads</h2>
        <p className="text-muted-foreground">Histórico de uploads do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Uploads</CardTitle>
          <CardDescription>Total de {uploads?.length || 0} uploads registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads?.map(upload => (
                <TableRow key={upload.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{upload.user.fullName}</div>
                      <div className="text-xs text-muted-foreground">{upload.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{upload.material.title}</TableCell>
                  <TableCell>{upload.material.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{upload.material.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{upload.file.designation}</div>
                      <div className="text-muted-foreground">{upload.file.type}</div>
                    </div>
                  </TableCell>
                  <TableCell>{upload.createdAt}</TableCell>
                  <TableCell>{getStatusBadge(upload.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={upload.file.path} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
