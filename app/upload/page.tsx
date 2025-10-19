'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  ImageIcon,
  Video,
  X,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { useUploadFile, useCreateMaterial } from '@/hooks/use-materials';
import { useSubjects, useSubjectsByCourse } from '@/hooks/use-subjects';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MaterialType, SubjectResponse } from '@/lib/api/types';
import { MaterialType as MaterialTypeEnum } from '@/lib/api/types';
import { Combobox } from '@/components/ui/combobox';
import { useCourses } from '@/hooks/use-courses';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<UploadFile | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType>(MaterialTypeEnum.OUTRO);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const uploadFileMutation = useUploadFile();
  const createMaterialMutation = useCreateMaterial();
  const { data: courses = [] } = useCourses();
  const { data: subjects = [] } = useSubjectsByCourse(selectedCourse);
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'video/mov',
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-green-600" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-blue-600" />;
    return <FileText className="h-5 w-5 text-red-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMaterialTypeFromFile = (fileType: string): MaterialType => {
    if (fileType === 'application/pdf') return MaterialTypeEnum.LIVRO;
    if (fileType.includes('word')) return MaterialTypeEnum.LIVRO;
    if (fileType.startsWith('image/')) return MaterialTypeEnum.IMAGEM;
    if (fileType.startsWith('video/')) return MaterialTypeEnum.VIDEO_AULA;
    return MaterialTypeEnum.OUTRO;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const selectedFile = selectedFiles[0];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Tipo de arquivo não suportado: ${selectedFile.name}`);
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setError(`Arquivo muito grande: ${selectedFile.name}. Máximo 50MB.`);
      return;
    }

    const uploadFile: UploadFile = {
      file: selectedFile,
      id: Math.random().toString(36).substr(2, 9),
    };

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        uploadFile.preview = e.target?.result as string;
        setFile(uploadFile);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(uploadFile);
    }

    setMaterialType(getMaterialTypeFromFile(selectedFile.type));
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setUploadedFileId('');
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo');
      return;
    }

    setError('');

    try {
      const response = await uploadFileMutation.mutateAsync(file.file);
      setUploadedFileId(response.data.id);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer upload do arquivo. Tente novamente.');
    }
  };

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }

    if (!selectedSubject) {
      setError('Selecione uma disciplina');
      return;
    }

    if (!uploadedFileId) {
      setError('Erro: ID do arquivo não encontrado');
      return;
    }

    try {
      await createMaterialMutation.mutateAsync({
        fileId: uploadedFileId,
        subjectId: selectedSubject,
        title: title.trim(),
        description: description.trim(),
        type: materialType,
        author: author,
      });

      router.push('/upload/success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar material. Tente novamente.');
    }
  };
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedSubject('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Contribuir com Material
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Partilhe material de estudos com a comunidade acadêmica da UJC
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                1
              </div>
              <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                Upload do Arquivo
              </span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
              <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                Informações do Material
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: File Upload */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Passo 1: Upload do Arquivo</CardTitle>
              <CardDescription>
                Faça upload do seu arquivo (PDF, Word, imagens, vídeos). Máximo 50MB por arquivo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Arraste um arquivo aqui ou clique para selecionar
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Suporta PDF, Word, imagens (JPG, PNG, GIF) e vídeos (MP4, AVI, MOV)
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                  onChange={e => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Selecionar Arquivo
                  </label>
                </Button>
              </div>

              {/* File Preview */}
              {file && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Arquivo selecionado:
                  </h4>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {getFileIcon(file.file.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{file.file.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(file.file.size)}
                      </p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {file.preview && (
                    <div className="mt-4">
                      <img
                        src={file.preview || '/placeholder.svg'}
                        alt="Preview"
                        className="max-h-48 rounded-lg mx-auto"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Upload Progress */}
              {uploadFileMutation.isPending && (
                <div className="mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Enviando arquivo...</span>
                    </div>
                    <Progress value={undefined} />
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="flex justify-end mt-6">
                <Button onClick={handleFileUpload} disabled={!file || uploadFileMutation.isPending}>
                  {uploadFileMutation.isPending ? 'Enviando...' : 'Próximo'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Material Information */}
        {step === 2 && (
          <form onSubmit={handleMaterialSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Passo 2: Informações do Material</CardTitle>
                <CardDescription>Descreva o material que está a partilhar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Exercícios de Cálculo I - Derivadas"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente o conteúdo do material..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Autor </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Dr João da Silva"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Curso *</Label>
                  <Combobox
                    options={courses.map(course => ({
                      value: course.id,
                      label: course.name,
                    }))}
                    value={selectedCourse}
                    onValueChange={handleCourseChange}
                    placeholder="Selecione um curso..."
                    searchPlaceholder="Pesquisar curso..."
                    emptyText="Nenhum curso encontrado."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Disciplina *</Label>
                  <Combobox
                    options={subjects.map(subject => ({
                      value: subject.id,
                      label: `${subject.name} (${subject.credits} créditos)`,
                    }))}
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                    placeholder={
                      selectedCourse ? 'Selecione uma disciplina...' : 'Primeiro selecione um curso'
                    }
                    searchPlaceholder="Pesquisar disciplina..."
                    emptyText="Nenhuma disciplina encontrada."
                    disabled={!selectedCourse}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Material *</Label>
                  <Select
                    value={materialType}
                    onValueChange={value => setMaterialType(value as MaterialType)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MaterialTypeEnum.FICHA}>Ficha de Apoio</SelectItem>
                      <SelectItem value={MaterialTypeEnum.LIVRO}>Livro</SelectItem>
                      <SelectItem value={MaterialTypeEnum.EBOOK}>E-book</SelectItem>
                      <SelectItem value={MaterialTypeEnum.ARTIGO}>Artigo</SelectItem>
                      <SelectItem value={MaterialTypeEnum.VIDEO_AULA}>Vídeo Aula</SelectItem>
                      <SelectItem value={MaterialTypeEnum.SLIDES}>Slides</SelectItem>
                      <SelectItem value={MaterialTypeEnum.TESTE}>Teste</SelectItem>
                      <SelectItem value={MaterialTypeEnum.EXERCICIOS}>Exercícios</SelectItem>
                      <SelectItem value={MaterialTypeEnum.IMAGEM}>Imagem</SelectItem>
                      <SelectItem value={MaterialTypeEnum.OUTRO}>Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button type="submit" disabled={createMaterialMutation.isPending}>
                {createMaterialMutation.isPending ? 'Criando...' : 'Criar Material'}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

interface UploadFile {
  file: File;
  id: string;
  preview?: string;
}
