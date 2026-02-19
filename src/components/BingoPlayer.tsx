import React, { useEffect, useRef, useState } from "react";
import { SongHistoryModal } from "./SongHistoryModal.tsx";

interface Song {
  id: string;
  name: string;
  artist: string;
  playedAt: string;
}

interface BingoPlayerProps {
  playlist: any[];
  onBack: () => void;
}

export const BingoPlayer: React.FC<BingoPlayerProps> = ({
  playlist,
  onBack,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [playedSongs, setPlayedSongs] = useState<Song[]>([]);
  const [availableSongs, setAvailableSongs] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [songProgress, setSongProgress] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar canciones disponibles
  useEffect(() => {
    setAvailableSongs([...playlist]);
  }, [playlist]);

  // Obtener preview de una canción
  const getPreviewUrl = async (trackId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/preview?trackId=${trackId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.preview_url || null;
    } catch {
      return null;
    }
  };

  // Seleccionar siguiente canción aleatoria
  const selectRandomSong = () => {
    if (availableSongs.length === 0) {
      alert("¡Todas las canciones de la playlist han sido reproducidas!");
      setIsPlaying(false);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    
    // Remover de disponibles
    setAvailableSongs(prev => prev.filter((_, index) => index !== randomIndex));
    
    return selectedSong;
  };

  // Reproducir canción
  const playNextSong = async () => {
    const nextSong = selectRandomSong();
    if (!nextSong) return;

    setCurrentSong(nextSong);
    setSongProgress(0);

    // Obtener preview
    const previewUrl = await getPreviewUrl(nextSong.id);
    
    if (previewUrl) {
      // Detener audio anterior
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // Crear nuevo audio
      const audio = new Audio(previewUrl);
      setCurrentAudio(audio);

      // Reproducir
      audio.play().then(() => {
        // Añadir a historial
        const songRecord: Song = {
          id: nextSong.id,
          name: nextSong.name,
          artist: nextSong.artists?.map((a: any) => a.name).join(", ") || "Artista desconocido",
          playedAt: new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        setPlayedSongs(prev => [...prev, songRecord]);

        // Progreso de 30 segundos
        let progress = 0;
        intervalRef.current = setInterval(() => {
          progress += 1;
          setSongProgress(progress);
          
          if (progress >= 30) {
            // Terminar canción y siguiente
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (isPlaying) {
              setTimeout(playNextSong, 1000); // Pausa de 1 segundo entre canciones
            }
          }
        }, 1000);
      });

      // Cuando termine naturalmente
      audio.onended = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (isPlaying) {
          setTimeout(playNextSong, 1000);
        }
      };
    } else {
      alert(`No se pudo reproducir "${nextSong.name}". Saltando...`);
      if (isPlaying) {
        setTimeout(playNextSong, 500);
      }
    }
  };

  // Controles Play/Pause
  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (!currentSong) {
        playNextSong();
      } else if (currentAudio) {
        currentAudio.play();
      }
    } else {
      setIsPlaying(false);
      if (currentAudio) {
        currentAudio.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center p-6 min-h-screen">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Header */}
        <div className="text-6xl mb-6">🎲</div>
        <h2 className="text-purple-400 text-3xl font-bold mb-2 text-center">
          Modo Bingo
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          {playlist.length} canciones en la playlist
        </p>

        {/* Estado actual */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 w-full border-2 border-purple-400/30">
          {currentSong ? (
            <>
              <div className="text-center mb-4">
                <h3 className="text-white font-bold text-lg mb-1">
                  Reproduciendo ahora:
                </h3>
                <p className="text-purple-400 font-semibold truncate">
                  {currentSong.name}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {currentSong.artists?.map((a: any) => a.name).join(", ")}
                </p>
              </div>
              
              {/* Progreso */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{formatTime(songProgress)}</span>
                  <span>30s</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(songProgress / 30) * 100}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-400">
                {isPlaying ? "Preparando siguiente canción..." : "Listo para empezar"}
              </p>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handlePlayPause}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 flex items-center gap-3 text-xl"
          >
            {isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-full transition-all transform hover:scale-105 flex items-center gap-2"
          >
            📋 Historial ({playedSongs.length})
          </button>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8 w-full">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-purple-400 font-bold text-lg">{playedSongs.length}</p>
              <p className="text-gray-400 text-sm">Reproducidas</p>
            </div>
            <div>
              <p className="text-green-400 font-bold text-lg">{availableSongs.length}</p>
              <p className="text-gray-400 text-sm">Restantes</p>
            </div>
          </div>
        </div>

        {/* Volver */}
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Nueva playlist
        </button>
      </div>

      {/* Modal de historial */}
      <SongHistoryModal
        songs={playedSongs}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};
