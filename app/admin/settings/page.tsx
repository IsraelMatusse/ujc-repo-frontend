"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerenciar configurações do sistema</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>Configurações básicas do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nome do Site</Label>
              <Input id="site-name" defaultValue="Repositório UJC" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Descrição</Label>
              <Input
                id="site-description"
                defaultValue="Repositório de Material de Estudos da Universidade Joaquim Chissano"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email de Contato</Label>
              <Input id="contact-email" type="email" defaultValue="contato@ujc.ac.mz" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploads</CardTitle>
            <CardDescription>Configurações de upload de arquivos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Moderação de Uploads</Label>
                <p className="text-sm text-muted-foreground">Requer aprovação do administrador para novos uploads</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="max-file-size">Tamanho Máximo de Arquivo (MB)</Label>
              <Input id="max-file-size" type="number" defaultValue="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowed-types">Tipos de Arquivo Permitidos</Label>
              <Input id="allowed-types" defaultValue="pdf, doc, docx, ppt, pptx, jpg, png, mp4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configurar notificações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificar Novos Uploads</Label>
                <p className="text-sm text-muted-foreground">Enviar email quando houver novos uploads pendentes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificar Novos Usuários</Label>
                <p className="text-sm text-muted-foreground">Enviar email quando novos usuários se registrarem</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Configurações de segurança do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">Requer verificação adicional no login</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}
