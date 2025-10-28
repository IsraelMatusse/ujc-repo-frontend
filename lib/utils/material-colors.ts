import type { MaterialType } from '@/lib/api/types';

export const getMaterialTypeColor = (type: MaterialType) => {
  const colors: Record<
    MaterialType,
    {
      badge: string;
      button: string;
      icon: string;
    }
  > = {
    FICHA: {
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: 'text-blue-600',
    },
    LIVRO: {
      badge:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      icon: 'text-purple-600',
    },
    EBOOK: {
      badge:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      icon: 'text-indigo-600',
    },
    ARTIGO: {
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      icon: 'text-green-600',
    },
    VIDEO_AULA: {
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-600',
    },
    SLIDES: {
      badge:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
      icon: 'text-orange-600',
    },
    TESTE: {
      badge:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      icon: 'text-yellow-600',
    },
    EXERCICIOS: {
      badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 border-teal-200',
      button: 'bg-teal-600 hover:bg-teal-700 text-white',
      icon: 'text-teal-600',
    },
    IMAGEM: {
      badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-200',
      button: 'bg-pink-600 hover:bg-pink-700 text-white',
      icon: 'text-pink-600',
    },
    OUTRO: {
      badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200',
      button: 'bg-gray-600 hover:bg-gray-700 text-white',
      icon: 'text-gray-600',
    },
  };

  return colors[type] || colors.OUTRO;
};

export const getMaterialTypeLabel = (type: MaterialType): string => {
  const labels: Record<MaterialType, string> = {
    FICHA: 'Ficha',
    LIVRO: 'Livro',
    EBOOK: 'E-book',
    ARTIGO: 'Artigo',
    VIDEO_AULA: 'Vídeo Aula',
    SLIDES: 'Slides',
    TESTE: 'Teste',
    EXERCICIOS: 'Exercícios',
    IMAGEM: 'Imagem',
    OUTRO: 'Outro',
  };

  return labels[type] || 'Outro';
};
