"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface Material {
  id: string
  title: string
  fileName: string
  fileSize: number
  downloads: number
}

export function useDownloadManager() {
  const [downloadHistory, setDownloadHistory] = useState<string[]>([])

  const downloadFile = async (material: Material): Promise<void> => {
    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, this would trigger the actual file download
      // For now, we'll simulate it
      const link = document.createElement("a")
      link.href = `/placeholder.pdf?filename=${material.fileName}`
      link.download = material.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Update download history
      setDownloadHistory((prev) => [...prev, material.id])

      // Show success toast
      toast({
        title: "Download iniciado",
        description: `${material.title} está sendo baixado.`,
      })

      // Update download count (in real app, this would be handled by the backend)
      console.log(`Download count updated for material ${material.id}`)
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const downloadMultiple = async (materials: Material[]): Promise<void> => {
    try {
      toast({
        title: "Download em lote iniciado",
        description: `Baixando ${materials.length} arquivos...`,
      })

      // Download each file with a small delay
      for (const material of materials) {
        await downloadFile(material)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      toast({
        title: "Downloads concluídos",
        description: `${materials.length} arquivos foram baixados com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro no download em lote",
        description: "Alguns arquivos podem não ter sido baixados.",
        variant: "destructive",
      })
    }
  }

  const hasDownloaded = (materialId: string): boolean => {
    return downloadHistory.includes(materialId)
  }

  return {
    downloadFile,
    downloadMultiple,
    hasDownloaded,
    downloadHistory,
  }
}
