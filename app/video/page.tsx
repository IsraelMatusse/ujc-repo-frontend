'use client';

import Video from 'next-video';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';

export default function VideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const videoSrc = searchParams.get('src') || '/videos/video1.mp4';
  const videoTitle = searchParams.get('title') || 'Vídeo em Destaque';
  const videoId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar aos materiais</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{videoTitle}</h1>
          <p className="text-gray-400 text-lg">Assista ao conteúdo completo abaixo</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
            <Video src={videoSrc} className="w-full h-full" controls />
          </div>

          {/* Video Info */}
          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Material de Estudo</h2>
                <p className="text-gray-400">Conteúdo educacional para seu aprendizado</p>
              </div>

              <div className="flex gap-3">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </button>
                <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Salvar
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4 border-t border-gray-700 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Vídeo educacional</span>
              </div>
              {videoId && (
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>ID: {videoId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
