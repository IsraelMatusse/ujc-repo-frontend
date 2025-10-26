'use client';

import { BookOpen, Upload, Download, Users, GraduationCap, FileText, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthHeader } from '@/components/auth-header';
import Link from 'next/link';
import { useStats } from '@/hooks/use-stats';

export default function HomePage() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <img src="ujc-logo.png" alt="" height={50} width={50} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Repositório UJC</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Faculdade de Ciências e Tecnologias
                </p>
              </div>
            </Link>
            <AuthHeader />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Faculdade de Ciências e Tecnologias
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Material de Estudos
            <span className="block text-blue-600 dark:text-blue-400">Sempre Disponível</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Acesse fichas de apoio, exercícios, testes e material de estudo organizados por curso,
            ano e semestre. Contribua com a comunidade acadêmica da UJC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/browse">
                <BookOpen className="h-5 w-5 mr-2" />
                Explorar Material
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/upload">
                <Upload className="h-5 w-5 mr-2" />
                Fazer Upload
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.materials}
                </div>
                <p className="text-gray-600 dark:text-gray-400">Documentos</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.subjects}
                </div>
                <p className="text-gray-600 dark:text-gray-400">Disciplinas</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.users}
                </div>
                <p className="text-gray-600 dark:text-gray-400">Usuários</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Book className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.courses}
                </div>
                <p className="text-gray-600 dark:text-gray-400">Cursos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Academic Structure */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Cursos Disponíveis
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Explore o material organizado por curso, ano e semestre
            </p>
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/browse">
                <GraduationCap className="h-5 w-5 mr-2" />
                Ver Todos os Cursos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className=" p-2 rounded-lg">
                  <img src="ujc-logo.png" alt="" height={50} width={50} />
                </div>
                <div>
                  <h4 className="font-bold">Repositório UJC</h4>
                  <p className="text-sm text-gray-400">Universidade Joaquim Chissano</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Plataforma colaborativa para partilha de material de estudos da Faculdade de
                Ciências e Tecnologias.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Links Rápidos</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/browse" className="hover:text-white">
                    Material de Estudos
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="hover:text-white">
                    Fazer Upload
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sobre o Projeto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Suporte</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Como Usar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Diretrizes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Reportar Problema
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Universidade Joaquim Chissano. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
