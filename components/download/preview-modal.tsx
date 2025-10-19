"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, X, FileText, ImageIcon, Video, Eye } from "lucide-react"

interface Material {
  id: string
  title: string
  description: string
  type: "pdf" | "doc" | "docx" | "image" | "video"
  fileName: string
  fileSize: number
  uploadedBy: string
  uploadedAt: Date
  downloads: number
  tags: string[]
}

interface PreviewModalProps {
  material: Material | null
  isOpen: boolean
  onClose: () => void
  onDownload: (materialId: string) => void
}

export function PreviewModal({ material, isOpen, onClose, onDownload }: PreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!material) return null

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "doc":
      case "docx":
        return <FileText className="h-8 w-8 text-red-600" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-green-600" />
      case "video":
        return <Video className="h-8 w-8 text-blue-600" />
      default:
        return <FileText className="h-8 w-8 text-gray-600" />
    }
  }

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`
    }
    return `${sizeInMB.toFixed(1)} MB`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await onDownload(material.id)
      // Close modal after successful download
      setTimeout(() => {
        onClose()
        setIsDownloading(false)
      }, 1000)
    } catch (error) {
      setIsDownloading(false)
    }
  }

  const renderPreview = () => {
    switch (material.type) {
      case "pdf":
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Pré-visualização de PDF não disponível. Faça o download para visualizar o conteúdo.
            </p>
          </div>
        )
      case "image":
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-8 text-center">
              <ImageIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Pré-visualização da imagem</p>
            </div>
          </div>
        )
      case "video":
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="h-16 w-16 mx-auto mb-4" />
                <p>Pré-visualização de vídeo</p>
                <p className="text-sm opacity-75">Clique em download para assistir</p>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Pré-visualização não disponível para este tipo de arquivo.
            </p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {getFileIcon(material.type)}
              <div>
                <DialogTitle className="text-xl">{material.title}</DialogTitle>
                <DialogDescription className="mt-1">{material.description}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Arquivo</p>
              <p className="font-medium">{material.fileName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamanho</p>
              <p className="font-medium">{formatFileSize(material.fileSize)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enviado por</p>
              <p className="font-medium">{material.uploadedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Data</p>
              <p className="font-medium">{formatDate(material.uploadedAt)}</p>
            </div>
          </div>

          {/* Tags */}
          {material.tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {material.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Pré-visualização:</p>
            {renderPreview()}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{material.downloads} downloads</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{Math.floor(material.downloads * 1.5)} visualizações</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                "Baixando..."
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Arquivo
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
