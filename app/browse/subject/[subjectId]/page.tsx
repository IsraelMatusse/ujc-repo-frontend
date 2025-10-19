'use client';

import { use, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Download,
  Search,
  FileText,
  ImageIcon,
  Video,
  ArrowLeft,
  Upload,
  Calendar,
  User,
  CheckCircle,
  FileIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useSubject } from '@/hooks/use-subjects';
import { useMaterialsBySubject } from '@/hooks/use-materials';

interface SubjectPageProps {
  params: Promise<{ subjectId: string }>;
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const { subjectId } = use(params);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: subject, isLoading: subjectLoading } = useSubject(subjectId);
  const { data: materialsResponse, isLoading: materialsLoading } = useMaterialsBySubject(subjectId);

  const materials = materialsResponse || [];

  const getFileIcon = (type: string) => {
    const iconType = type.toLowerCase();
    if (iconType.includes('pdf') || iconType.includes('document')) {
      return <FileText className="h-5 w-5 text-red-600" />;
    }
    if (iconType.includes('image') || iconType.includes('png') || iconType.includes('jpg')) {
      return <ImageIcon className="h-5 w-5 text-green-600" />;
    }
    if (iconType.includes('video') || iconType.includes('mp4')) {
      return <Video className="h-5 w-5 text-blue-600" />;
    }
    return <FileIcon className="h-5 w-5 text-gray-600" />;
  };

  const getMaterialTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> =
      {
        FICHA: { label: 'Ficha', variant: 'default' },
        LIVRO: { label: 'Livro', variant: 'secondary' },
        EBOOK: { label: 'E-book', variant: 'secondary' },
        ARTIGO: { label: 'Artigo', variant: 'outline' },
        VIDEO_AULA: { label: 'Vídeo Aula', variant: 'default' },
        SLIDES: { label: 'Slides', variant: 'secondary' },
        TESTE: { label: 'Teste', variant: 'default' },
        EXERCICIOS: { label: 'Exercícios', variant: 'default' },
        IMAGEM: { label: 'Imagem', variant: 'outline' },
        OUTRO: { label: 'Outro', variant: 'outline' },
      };
    return badges[type] || badges.OUTRO;
  };

  const handleDownload = (material: any) => {
    window.open(material.file.path, '_blank');
  };

  const handleBulkDownload = () => {
    const selectedMats = materials.filter((m: any) => selectedMaterials.includes(m.id));
    selectedMats.forEach((material: any) => {
      window.open(material.file.path, '_blank');
    });
    setSelectedMaterials([]);
  };

  const toggleMaterialSelection = (materialId: string) => {
    setSelectedMaterials(prev =>
      prev.includes(materialId) ? prev.filter(id => id !== materialId) : [...prev, materialId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedMaterials.length === materials.length) {
      setSelectedMaterials([]);
    } else {
      setSelectedMaterials(materials.map((m: any) => m.id));
    }
  };

  const filteredMaterials = materials.filter((material: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      material.title.toLowerCase().includes(searchLower) ||
      material.description?.toLowerCase().includes(searchLower) ||
      material.type.toLowerCase().includes(searchLower)
    );
  });

  const materialsByType = filteredMaterials.reduce((acc: any, material: any) => {
    const type = material.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(material);
    return acc;
  }, {});

  if (subjectLoading || materialsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Disciplina não encontrada</p>
          <Button asChild>
            <Link href="/browse">Voltar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/browse">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{subject.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span>{subject.credits} créditos</span>
                  <span>•</span>
                  <span>{materials.length} documentos</span>
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Contribuir
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar material..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedMaterials.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {selectedMaterials.length} arquivo(s) selecionado(s)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedMaterials([])}>
                  Limpar
                </Button>
                <Button size="sm" onClick={handleBulkDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Selecionados
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Material Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Todos ({filteredMaterials.length})</TabsTrigger>
            {Object.keys(materialsByType).map(type => (
              <TabsTrigger key={type} value={type}>
                {getMaterialTypeBadge(type).label} ({materialsByType[type].length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredMaterials.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="select-all"
                  checked={selectedMaterials.length === filteredMaterials.length}
                  onCheckedChange={toggleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  Selecionar todos
                </label>
              </div>
            )}

            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum material disponível
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Seja o primeiro a contribuir com material para esta disciplina
                </p>
                <Button asChild>
                  <Link href="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload
                  </Link>
                </Button>
              </div>
            ) : (
              filteredMaterials.map((material: any) => {
                const typeBadge = getMaterialTypeBadge(material.type);
                return (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedMaterials.includes(material.id)}
                          onCheckedChange={() => toggleMaterialSelection(material.id)}
                          className="mt-1"
                        />

                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">{getFileIcon(material.file.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {material.title}
                              </h3>
                              <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                            </div>

                            {material.description && (
                              <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {material.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              {material.author && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{material.author}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{material.createdAt}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileIcon className="h-4 w-4" />
                                <span>{material.file.designation}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button size="sm" onClick={() => handleDownload(material)}>
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Tabs por tipo de material */}
          {Object.keys(materialsByType).map(type => (
            <TabsContent key={type} value={type} className="space-y-4">
              {materialsByType[type].map((material: any) => {
                const typeBadge = getMaterialTypeBadge(material.type);
                return (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getFileIcon(material.file.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {material.title}
                            </h3>
                            <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                          </div>

                          {material.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {material.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {material.author && (
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{material.author}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{material.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        <Button size="sm" onClick={() => handleDownload(material)}>
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
