import { Logo } from "./Logo.tsx";
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

type BingoState = "idle" | "playing" | "reveal";

export const BingoPlayer: React.FC<BingoPlayerProps> = ({ playlist, onBack }) => {
  const [state, setState] = useState<BingoState>("idle");
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [playedSongs, setPlayedSongs] = useState<Song[]>([]);
  const [availableSongs, setAvailableSongs] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const availableSongsRef = useRef<any[]>([]);

  useEffect(() => {
    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
    setAvailableSongs(shuffled);
    availableSongsRef.current = shuffled;
  }, [playlist]);

  const clearProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    clearProgress();
  };

  const getPreviewUrl = async (trackId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/preview?trackId=${trackId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.preview_url || null;
    } catch { return null; }
  };

  const playNextSong = async () => {
    const available = availableSongsRef.current;
    if (available.length === 0) {
      alert("¡Todas las canciones han sido reproducidas!");
      setState("idle");
      return;
    }

    stopAudio();
    setSongProgress(0);
    setIsLoading(true);
    setState("playing");

    const randomIndex = Math.floor(Math.random() * available.length);
    const nextSong = available[randomIndex];
    const newAvailable = available.filter((_, i) => i !== randomIndex);
    availableSongsRef.current = newAvailable;
    setAvailableSongs(newAvailable);
    setCurrentSong(nextSong);

    const previewUrl = await getPreviewUrl(nextSong.id);
    setIsLoading(false);

    if (!previewUrl) {
      if (availableSongsRef.current.length > 0) {
        setTimeout(playNextSong, 300);
      } else {
        setState("idle");
      }
      return;
    }

    const audio = new Audio(previewUrl);
    audioRef.current = audio;
    audio.load();

    try {
      await audio.play();
    } catch {
      setState("idle");
      return;
    }

    const songRecord: Song = {
      id: nextSong.id,
      name: nextSong.name,
      artist: nextSong.artists?.map((a: any) => a.name).join(", ") || "Artista desconocido",
      playedAt: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    };
    setPlayedSongs(prev => [...prev, songRecord]);

    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress += 1;
      setSongProgress(progress);
      if (progress >= 30) {
        clearProgress();
        stopAudio();
        setState("reveal");
      }
    }, 1000);

    audio.onended = () => {
      clearProgress();
      setState("reveal");
    };
  };

  const handleNext = () => {
    setState("idle");
    setCurrentSong(null);
    setSongProgress(0);
  };

  useEffect(() => {
    return () => { stopAudio(); };
  }, []);

  return (
    <div className="flex flex-col items-center p-6 w-full max-w-sm mx-auto gap-6">

      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <Logo />
        <p className="text-sm" style={{ color: "rgba(0,0,0,0.3)" }}>
          {playlist.length} canciones · {availableSongs.length} restantes
        </p>
      </div>

      {/* IDLE */}
      {state === "idle" && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={playNextSong}
            className="relative flex items-center justify-center rounded-2xl transition-all hover:scale-[1.04] active:scale-[0.97]"
            style={{
              width: "160px", height: "160px",
              background: "rgba(232,23,93,0.07)",
              border: "1.5px solid rgba(232,23,93,0.2)",
              animation: "redPulse 2.5s ease-in-out infinite",
            }}
          >
            <span className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: "2px solid #E8175D", borderLeft: "2px solid #E8175D" }} />
            <span className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: "2px solid #E8175D", borderRight: "2px solid #E8175D" }} />
            <span className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: "2px solid #E8175D", borderLeft: "2px solid #E8175D" }} />
            <span className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: "2px solid #E8175D", borderRight: "2px solid #E8175D" }} />
            <span style={{ fontSize: "48px" }}>🎵</span>
          </button>
          <span className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#E8175D", letterSpacing: "0.25em", fontFamily: "'Russo One', sans-serif" }}>
            {playedSongs.length === 0 ? "EMPEZAR BINGO" : "SIGUIENTE CANCIÓN"}
          </span>
          <p className="text-sm text-center" style={{ color: "rgba(0,0,0,0.25)" }}>
            Previews de 30 segundos · Funciona para todos
          </p>
        </div>
      )}

      {/* PLAYING */}
      {state === "playing" && (
        <div className="w-full rounded-2xl p-6 text-center"
          style={{ background: "#EFEFEF", border: "1px solid rgba(0,0,0,0.07)" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: isLoading ? "rgba(232,23,93,0.5)" : "rgba(0,0,0,0.3)" }}>
            {isLoading ? "⏳ Cargando..." : "▶ SONANDO"}
          </p>
          {!isLoading && (
            <div className="flex items-center gap-1 h-14 mb-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-sm wave-bar"
                  style={{ background: "#E8175D", height: `${30 + Math.random() * 70}%` }} />
              ))}
            </div>
          )}
          <div className="w-full rounded-full h-2 mb-2" style={{ background: "rgba(0,0,0,0.08)" }}>
            <div className="h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(songProgress / 30) * 100}%`, background: "#E8175D" }} />
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-bold" style={{ color: "rgba(0,0,0,0.4)" }}>{songProgress}s</span>
            <span className="text-sm" style={{ color: "rgba(0,0,0,0.25)" }}>30s</span>
          </div>
          <p className="text-sm font-bold mt-4" style={{ color: "rgba(0,0,0,0.35)" }}>
            ¿La reconoces? ¡Márcala en tu cartón!
          </p>
        </div>
      )}

      {/* REVEAL */}
      {state === "reveal" && (
        <>
          <div className="w-full rounded-2xl p-6 text-center"
            style={{ background: "#EFEFEF", border: "1.5px solid rgba(232,23,93,0.2)", boxShadow: "0 0 40px rgba(232,23,93,0.06)" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "rgba(232,23,93,0.6)" }}>
              ⏱ TIEMPO AGOTADO
            </p>
            <p className="text-lg font-bold"
              style={{ fontFamily: "'Russo One', sans-serif", color: "rgba(0,0,0,0.4)" }}>
              ¿La has marcado en tu cartón?
            </p>
          </div>
          <button onClick={handleNext}
            className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "#E8175D", color: "#fff", fontFamily: "'Russo One', sans-serif", fontSize: "16px", letterSpacing: "0.1em", boxShadow: "0 8px 30px rgba(232,23,93,0.2)" }}>
            → SIGUIENTE CANCIÓN
          </button>
        </>
      )}

      {/* Stats */}
      <div className="w-full grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 text-center"
          style={{ background: "#EFEFEF", border: "1px solid rgba(0,0,0,0.07)" }}>
          <p className="text-2xl font-bold" style={{ fontFamily: "'Russo One', sans-serif", color: "#E8175D" }}>
            {playedSongs.length}
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(0,0,0,0.3)" }}>Reproducidas</p>
        </div>
        <button onClick={() => setShowHistory(true)}
          className="rounded-2xl p-4 text-center transition-all hover:opacity-80"
          style={{ background: "#EFEFEF", border: "1px solid rgba(27,79,155,0.15)" }}>
          <p className="text-2xl font-bold" style={{ fontFamily: "'Russo One', sans-serif", color: "rgba(27,79,155,0.6)" }}>
            📋
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(0,0,0,0.3)" }}>Ver historial</p>
        </button>
      </div>

      <button onClick={onBack}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(0,0,0,0.25)" }}>
        ← Nueva playlist
      </button>

      <SongHistoryModal songs={playedSongs} isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
};
