import { useEffect, useState } from "react";
import { ScanButton } from "./ScanButton.tsx";
import { PlayingView } from "./PlayingView.tsx";
import { ErrorView } from "./ErrorView.tsx";
import { ModeSelection } from "./ModeSelection.tsx";
import { PlaylistScanner } from "./PlaylistScanner.tsx";
import { BingoPlayer } from "./BingoPlayer.tsx";
import { ReadyToPlay } from "./ReadyToPlay.tsx";
import { FlipAndPlay } from "./FlipAndPlay.tsx";
import { SongDone } from "./SongDone.tsx";
import { QrScanner } from "@yudiel/react-qr-scanner";

interface MainProps {
  accessToken: string;
  resetTrigger: number;
  isActive: (active: boolean) => void;
}

function Main({ accessToken, resetTrigger, isActive }: MainProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFreeAccount, setIsFreeAccount] = useState(true);

  const [showReady, setShowReady] = useState(false);
  const [showFlipAndPlay, setShowFlipAndPlay] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);

  const [showModeSelection, setShowModeSelection] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"normal" | "bingo" | null>(null);

  const [showPlaylistScanner, setShowPlaylistScanner] = useState(false);
  const [showBingoPlayer, setShowBingoPlayer] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<any[]>([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);

  useEffect(() => {
    const active = isScanning || isError || !!scannedUrl || showReady || showFlipAndPlay || showDone ||
      showModeSelection || showPlaylistScanner || showBingoPlayer;
    isActive(active);
  }, [isScanning, isError, scannedUrl, showReady, showFlipAndPlay, showDone,
    showModeSelection, showPlaylistScanner, showBingoPlayer]);

  useEffect(() => {
    if (resetTrigger > 0) resetToStart();
  }, [resetTrigger]);

  useEffect(() => {
    if (!showModeSelection && !selectedMode &&
      !isScanning && !scannedUrl && !showReady && !showFlipAndPlay && !showDone &&
      !showPlaylistScanner && !showBingoPlayer) {
      setShowModeSelection(true);
    }
  }, [showModeSelection, selectedMode, isScanning, scannedUrl,
    showReady, showFlipAndPlay, showDone, showPlaylistScanner, showBingoPlayer]);

  const getPreviewUrl = async (trackUrl: string): Promise<string | null> => {
    try {
      const trackId = trackUrl.split("/track/")[1]?.split("?")[0];
      if (!trackId) return null;
      const response = await fetch(`/api/preview?trackId=${trackId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.preview_url || null;
    } catch { return null; }
  };

  const fetchPlaylistTracks = async (playlistUrl: string): Promise<any[]> => {
    try {
      const playlistId = playlistUrl
        .split("open.spotify.com/playlist/")[1]
        ?.split("?")[0];
      if (!playlistId) throw new Error("ID de playlist inválido");

      const params = new URLSearchParams({ playlistId, accessToken });
      const response = await fetch(`/api/playlist?${params.toString()}`);
      if (!response.ok) throw new Error("Error al cargar la playlist");
      const data = await response.json();

      // Backend returns { tracks: [...] }
      const tracks = (data.tracks || []).filter((t: any) => t && t.id);
      return tracks;
    } catch (err) {
      console.error("Error fetching playlist:", err);
      throw err;
    }
  };

  const handleScan = async (result: string) => {
    if (!result?.startsWith("https://open.spotify.com/track/")) {
      setIsError(true);
      setIsScanning(false);
      return;
    }
    setScannedUrl(result);
    setIsScanning(false);
    const preview = await getPreviewUrl(result);
    if (preview) {
      setPreviewUrl(preview);
      setShowReady(true);
    } else {
      alert("Esta canción no tiene preview.\n\nPrueba con otra canción.");
      setScannedUrl(null);
      setIsScanning(true);
    }
  };

  const handleStartPlay = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== "granted") {
          alert("Necesitamos permiso del giroscopio");
          return;
        }
      } catch { return; }
    }
    setShowReady(false);
    setShowFlipAndPlay(true);
  };

  const handleSongEnded = () => {
    setShowFlipAndPlay(false);
    setShowDone(true);
  };

  const handleModeNormal = () => {
    setSelectedMode("normal");
    setShowModeSelection(false);
  };

  const handleModeBingo = () => {
    setSelectedMode("bingo");
    setShowModeSelection(false);
    setShowPlaylistScanner(true);
  };

  const handlePlaylistScanned = async (playlistUrl: string) => {
    setIsLoadingPlaylist(true);
    try {
      const tracks = await fetchPlaylistTracks(playlistUrl);
      if (tracks.length === 0) {
        alert("La playlist está vacía o no se pudieron cargar las canciones.");
        setIsLoadingPlaylist(false);
        return;
      }
      setCurrentPlaylist(tracks);
      setShowPlaylistScanner(false);
      setShowBingoPlayer(true);
    } catch {
      alert("Error al cargar la playlist. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setIsLoadingPlaylist(false);
    }
  };

  const handleBingoBack = () => {
    setShowBingoPlayer(false);
    setShowPlaylistScanner(true);
    setCurrentPlaylist([]);
  };

  const handleBackToModes = () => {
    setSelectedMode(null);
    setShowModeSelection(true);
    resetToStart();
  };

  const resetScanner = () => {
    setScannedUrl(null);
    setIsError(false);
    setIsScanning(true);
    setIsPlaying(false);
    setShowReady(false);
    setShowFlipAndPlay(false);
    setPreviewUrl(null);
    setShowDone(false);
  };

  const resetToStart = () => {
    setScannedUrl(null);
    setIsError(false);
    setIsScanning(false);
    setIsPlaying(false);
    setShowReady(false);
    setShowFlipAndPlay(false);
    setPreviewUrl(null);
    setShowDone(false);
    setShowModeSelection(false);
    setSelectedMode(null);
    setShowPlaylistScanner(false);
    setShowBingoPlayer(false);
    setCurrentPlaylist([]);
  };

  // Loading state while fetching playlist
  if (isLoadingPlaylist) return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(202,255,0,0.08)", border: "1.5px solid rgba(202,255,0,0.2)", animation: "acidPulse 1.5s ease-in-out infinite" }}>
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
          <rect x="8" y="8" width="8" height="8" rx="1" fill="#CAFF00"/>
          <rect x="28" y="4" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
          <rect x="32" y="8" width="8" height="8" rx="1" fill="#CAFF00"/>
          <rect x="4" y="28" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
          <rect x="8" y="32" width="8" height="8" rx="1" fill="#CAFF00"/>
        </svg>
      </div>
      <p style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00", fontSize: "16px" }}>
        CARGANDO PLAYLIST...
      </p>
      <p className="text-sm" style={{ color: "rgba(245,242,235,0.3)" }}>
        Obteniendo canciones de Spotify
      </p>
    </div>
  );

  if (showModeSelection) return <ModeSelection onSelectNormal={handleModeNormal} onSelectBingo={handleModeBingo} onInstructions={() => {}} />;
  if (showPlaylistScanner) return <PlaylistScanner onPlaylistScanned={handlePlaylistScanned} onError={() => setIsError(true)} onCancel={handleBackToModes} />;
  if (showBingoPlayer) return <BingoPlayer playlist={currentPlaylist} onBack={handleBingoBack} />;
  if (showReady) return <ReadyToPlay onStart={handleStartPlay} onCancel={handleBackToModes} />;
  if (showFlipAndPlay && previewUrl) return <FlipAndPlay previewUrl={previewUrl} onEnded={handleSongEnded} onCancel={handleBackToModes} />;
  if (showDone) return <SongDone onNext={resetScanner} onReset={handleBackToModes} />;
  if (isError) return <ErrorView onRetry={resetScanner} />;

  return isScanning ? (
    <div className="w-full max-w-sm flex flex-col items-center gap-4">
      <div className="w-full rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid rgba(202,255,0,0.2)", boxShadow: "0 0 40px rgba(202,255,0,0.08)" }}>
        <QrScanner
          onDecode={handleScan}
          onError={() => { setIsError(true); setIsScanning(false); }}
          scanDelay={500}
          hideCount
          audio={false}
          constraints={{ facingMode: "environment" }}
        />
      </div>
      <p className="text-xs font-bold tracking-widest uppercase text-center"
        style={{ color: "rgba(245,242,235,0.25)" }}>
        Apunta al QR de la carta
      </p>
      <button onClick={handleBackToModes}
        className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.2)" }}>
        ← Cambiar modo
      </button>
    </div>
  ) : selectedMode === "normal" ? (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <ScanButton onClick={() => setIsScanning(true)} />
      <p className="text-xs text-center font-bold tracking-wider"
        style={{ color: "rgba(245,242,235,0.25)" }}>
        Previews de 30 segundos · Funciona para todos
      </p>
      <button onClick={handleBackToModes}
        className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.2)" }}>
        ← Cambiar modo
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="text-5xl">🎵</div>
      <h2 className="text-xl" style={{ fontFamily: "'Russo One', sans-serif", color: "rgba(245,242,235,0.6)" }}>
        ScanHits
      </h2>
    </div>
  );
}

export default Main;
