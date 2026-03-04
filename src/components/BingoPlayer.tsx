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

export const BingoPlayer: React.FC<BingoPlayerProps> = ({ playlist, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [playedSongs, setPlayedSongs] = useState<Song[]>([]);
  const [availableSongs, setAvailableSongs] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [songProgress, setSongProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setAvailableSongs([...playlist]);
  }, [playlist]);

  const getPreviewUrl = async (trackId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/preview?trackId=${trackId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.preview_url || null;
    } catch { return null; }
  };

  const selectRandomSong = () => {
    if (availableSongs.length === 0) {
      alert("¡Todas las canciones han sido reproducidas!");
      setIsPlaying(false);
      return null;
    }
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    setAvailableSongs(prev => prev.filter((_, i) => i !== randomIndex));
    return selectedSong;
  };

  const playNextSong = async () => {
    const nextSong = selectRandomSong();
    if (!nextSong) return;
    setCurrentSong(nextSong);
    setSongProgress(0);
    const previewUrl = await getPreviewUrl(nextSong.id);
    if (previewUrl) {
      if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
      const audio = new Audio(previewUrl);
      setCurrentAudio(audio);
      audio.play().then(() => {
        const songRecord: Song = {
          id: nextSong.id,
          name: nextSong.name,
          artist: nextSong.artists?.map((a: any) => a.name).join(", ") || "Artista desconocido",
          playedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        setPlayedSongs(prev => [...prev, songRecord]);
        let progress = 0;
        intervalRef.current = setInterval(() => {
          progress += 1;
          setSongProgress(progress);
          if (progress >= 30) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (isPlaying) setTimeout(playNextSong, 1000);
          }
        }, 1000);
      });
      audio.onended = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (isPlaying) setTimeout(playNextSong, 1000);
      };
    } else {
      alert(`Sin preview para "${nextSong.name}". Saltando...`);
      if (isPlaying) setTimeout(playNextSong, 500);
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (!currentSong) { playNextSong(); }
      else if (currentAudio) { currentAudio.play(); }
    } else {
      setIsPlaying(false);
      if (currentAudio) currentAudio.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (currentAudio) currentAudio.pause();
    };
  }, [currentAudio]);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-5">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl tracking-wide mb-1"
          style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00" }}>
          MODO BINGO
        </h2>
        <p className="text-sm" style={{ color: "rgba(245,242,235,0.3)" }}>
          {playlist.length} canciones · {availableSongs.length} restantes
        </p>
      </div>

      {/* Current song card */}
      <div className="w-full rounded-2xl p-5"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}>
        {currentSong ? (
          <>
            <p className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "rgba(245,242,235,0.3)" }}>
              {isPlaying ? "▶ Sonando ahora" : "⏸ Pausado"}
            </p>
            <p className="text-lg font-bold mb-1 truncate"
              style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00" }}>
              {currentSong.name}
            </p>
            <p className="text-sm mb-4 truncate" style={{ color: "rgba(245,242,235,0.4)" }}>
              {currentSong.artists?.map((a: any) => a.name).join(", ")}
            </p>
            {/* Waveform / progress */}
            {isPlaying && (
              <div className="flex items-center gap-1 h-8 mb-3">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-sm wave-bar"
                    style={{ background: "#CAFF00", height: `${30 + Math.random() * 70}%` }} />
                ))}
              </div>
            )}
            <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${(songProgress / 30) * 100}%`, background: "#CAFF00" }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: "rgba(245,242,235,0.3)" }}>{songProgress}s</span>
              <span className="text-xs" style={{ color: "rgba(245,242,235,0.3)" }}>30s</span>
            </div>
          </>
        ) : (
          <p className="text-base text-center py-2" style={{ color: "rgba(245,242,235,0.3)" }}>
            {isPlaying ? "Cargando canción..." : "Pulsa play para empezar"}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="w-full grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 text-center"
          style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-2xl font-bold" style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00" }}>
            {playedSongs.length}
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,242,235,0.3)" }}>Reproducidas</p>
        </div>
        <div className="rounded-2xl p-4 text-center"
          style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-2xl font-bold" style={{ fontFamily: "'Russo One', sans-serif", color: "rgba(202,255,0,0.5)" }}>
            {availableSongs.length}
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,242,235,0.3)" }}>Restantes</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 w-full">
        <button onClick={handlePlayPause}
          className="flex-1 py-4 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "#CAFF00", color: "#000", fontFamily: "'Russo One', sans-serif", fontSize: "16px", boxShadow: "0 8px 30px rgba(202,255,0,0.2)" }}>
          {isPlaying ? "⏸ PAUSAR" : "▶ PLAY"}
        </button>
        <button onClick={() => setShowHistory(true)}
          className="py-4 px-4 rounded-2xl font-bold transition-all hover:opacity-80"
          style={{ background: "rgba(202,255,0,0.07)", border: "1.5px solid rgba(202,255,0,0.2)", color: "#CAFF00", fontFamily: "'Russo One', sans-serif", fontSize: "13px" }}>
          📋 {playedSongs.length}
        </button>
      </div>

      {/* Back */}
      <button onClick={onBack}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.25)" }}>
        ← Nueva playlist
      </button>

      <SongHistoryModal
        songs={playedSongs}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};
