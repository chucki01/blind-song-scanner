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
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerActivated, setPlayerActivated] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
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

  useEffect(() => {
    const active = isScanning || isError || scannedUrl || showReady || showFlipAndPlay || showDone ||
      showModeSelection || showPlaylistScanner || showBingoPlayer;
    isActive(active);
  }, [isScanning, isError, scannedUrl, showReady, showFlipAndPlay, showDone, showModeSelection,
    showPlaylistScanner, showBingoPlayer]);

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
    } catch {
      return null;
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
      alert("Esta canción no tiene preview de 30 segundos.\n\nPrueba con otra canción.");
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
      } catch {
        return;
      }
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
    try {
      let playlist;
      let gameVersion = "Unknown";

      if (playlistUrl.includes("eurovision") || playlistUrl.includes("37i9dQZF1DX0XUsuxWHRQd")) {
        gameVersion = "Eurovisión Edition";
        playlist = [
          { id: "4iEEgA4wPtzCp9jfZ8aHlh", name: "Waterloo", artists: [{ name: "ABBA" }], duration_ms: 164000 },
          { id: "5HKnTk2iLXRfLSkjJE9ZxQ", name: "Euphoria", artists: [{ name: "Loreen" }], duration_ms: 180000 },
        ];
      } else if (playlistUrl.includes("popespanol") || playlistUrl.includes("37i9dQZF1DWXRqgorJj26U")) {
        gameVersion = "Pop Español Edition";
        playlist = [
          { id: "5aB6Cd7EfG8hI9jK0lM1nO", name: "Macarena", artists: [{ name: "Los Del Rio" }], duration_ms: 231000 },
        ];
      } else {
        gameVersion = "Electronic Hits Edition";
        playlist = [
          { id: "5uuJruktM9fMdN9Va0DUMp", name: "Sandstorm", artists: [{ name: "Darude" }], duration_ms: 231000 },
        ];
      }

      setCurrentPlaylist(playlist);
      setShowPlaylistScanner(false);
      setShowBingoPlayer(true);
    } catch {
      alert("Error al cargar la playlist");
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

  if (showModeSelection) return <ModeSelection onSelectNormal={handleModeNormal} onSelectBingo={handleModeBingo} />;
  if (showPlaylistScanner) return <PlaylistScanner onPlaylistScanned={handlePlaylistScanned} onError={() => setIsError(true)} onCancel={handleBackToModes} />;
  if (showBingoPlayer) return <BingoPlayer playlist={currentPlaylist} onBack={handleBingoBack} />;
  if (showReady) return <ReadyToPlay onStart={handleStartPlay} onCancel={handleBackToModes} />;
  if (showFlipAndPlay && previewUrl) return <FlipAndPlay previewUrl={previewUrl} onEnded={handleSongEnded} onCancel={handleBackToModes} />;
  if (showDone) return <SongDone onNext={resetScanner} onReset={handleBackToModes} />;
  if (isError) return <ErrorView onRetry={resetScanner} />;

  return isScanning ? (
    /* QR Scanner view */
    <div className="w-full max-w-sm flex flex-col items-center gap-4">
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid rgba(202,255,0,0.2)", boxShadow: "0 0 40px rgba(202,255,0,0.08)" }}
      >
        <QrScanner
          onDecode={handleScan}
          onError={() => { setIsError(true); setIsScanning(false); }}
          scanDelay={500}
          hideCount
          audio={false}
          constraints={{ facingMode: "environment" }}
        />
      </div>
      <p
        className="text-xs font-bold tracking-widest uppercase text-center"
        style={{ color: "rgba(245,242,235,0.25)", fontFamily: "Raleway, sans-serif" }}
      >
        Apunta al QR de la carta
      </p>
      <button
        onClick={handleBackToModes}
        className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.2)", fontFamily: "Raleway, sans-serif" }}
      >
        ← Cambiar modo
      </button>
    </div>
  ) : selectedMode === "normal" ? (
    /* Normal mode home */
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <ScanButton onClick={() => setIsScanning(true)} />

      <p
        className="text-xs text-center font-bold tracking-wider"
        style={{ color: "rgba(245,242,235,0.25)", fontFamily: "Raleway, sans-serif" }}
      >
        Previews de 30 segundos · Funciona para todos
      </p>

      <button
        onClick={handleBackToModes}
        className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.2)", fontFamily: "Raleway, sans-serif" }}
      >
        ← Cambiar modo
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="text-5xl">🎵</div>
      <h2
        className="text-xl"
        style={{ fontFamily: "'Russo One', sans-serif", color: "rgba(245,242,235,0.6)" }}
      >
        ScanHits
      </h2>
      <p className="text-sm" style={{ color: "rgba(245,242,235,0.3)" }}>
        Previews de 30 segundos
      </p>
    </div>
  );
}

export default Main;
