import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Upload, Home, Search } from "lucide-react"
import Link from "next/link"

export default function UploadSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800 dark:text-green-200">Material Enviado!</CardTitle>
          <CardDescription className="text-lg">
            O seu material foi enviado com sucesso e está a ser revisado pela nossa equipa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Próximos passos:</strong>
              <br />• O material será revisado em até 24 horas
              <br />• Receberá uma notificação quando for aprovado
              <br />• O material ficará disponível para toda a comunidade
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Enviar Mais Material
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/browse">
                <Search className="h-4 w-4 mr-2" />
                Explorar Material
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
