import { useEffect, useState } from "react";
import { ScanButton } from "./ScanButton.tsx";
import { PlayingView } from "./PlayingView.tsx";
import { ErrorView } from "./ErrorView.tsx";
import { ActivatePlayerView } from "./ActivatePlayerView.tsx";
import { ModeSelection } from "./ModeSelection.tsx";
import { PlaylistScanner } from "./PlaylistScanner.tsx";
import { BingoPlayer } from "./BingoPlayer.tsx";
import { ReadyToPlay } from "./ReadyToPlay.tsx";
import { FlipAndPlay } from "./FlipAndPlay.tsx";
import { SongDone } from "./SongDone.tsx";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { LoadingIcon } from "./icons/LoadingIcon.tsx";

interface MainProps {
  accessToken: string;
  resetTrigger: number;
  isActive: (active: boolean) => void;
}

const isAndroid = () => /android/.test(navigator.userAgent.toLowerCase());

function Main({ accessToken, resetTrigger, isActive }: MainProps) {
  // Estados básicos
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerActivated, setPlayerActivated] = useState(!isAndroid());
  const [isInitializing, setIsInitializing] = useState(false);
  const [isFreeAccount, setIsFreeAccount] = useState(false);
  
  // Estados para modo normal
  const [showReady, setShowReady] = useState(false);
  const [showFlipAndPlay, setShowFlipAndPlay] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  
  // Estados para selección de modo
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'normal' | 'bingo' | null>(null);
  
  // Estados para modo bingo
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

  const initializePlayer = async () => {
    if (spotifyPlayer) return;
    
    setIsInitializing(true);

    try {
      const player = new window.Spotify.Player({
        name: "Blind Song Scanner",
        getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("✅ Premium");
        setDeviceId(device_id);
        setIsFreeAccount(false);
        setIsInitializing(false);
      });

      player.addListener("account_error", () => {
        console.log("✅ Free");
        setIsFreeAccount(true);
        setDeviceId("free");
        setIsInitializing(false);
      });

      player.addListener("player_state_changed", (state) => {
        if (state) setIsPlaying(!state.paused);
      });

      const success = await player.connect();
      if (success) {
        setSpotifyPlayer(player);
      } else {
        setIsFreeAccount(true);
        setDeviceId("free");
        setIsInitializing(false);
      }
    } catch {
      setIsFreeAccount(true);
      setDeviceId("free");
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (playerActivated && !isAndroid()) initializePlayer();
  }, [playerActivated]);

  // Mostrar selección de modo cuando el player está listo
  useEffect(() => {
    if (deviceId && !isInitializing && !showModeSelection && !selectedMode && 
        !isScanning && !scannedUrl && !showReady && !showFlipAndPlay && !showDone && 
        !showPlaylistScanner && !showBingoPlayer) {
      setShowModeSelection(true);
    }
  }, [deviceId, isInitializing, showModeSelection, selectedMode, isScanning, scannedUrl, 
      showReady, showFlipAndPlay, showDone, showPlaylistScanner, showBingoPlayer]);

  useEffect(() => {
    if (spotifyPlayer && scannedUrl && deviceId && !isFreeAccount && deviceId !== "free") {
      const uri = scannedUrl.replace("https://open.spotify.com/track/", "spotify:track:").split("?")[0];
      
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }).then(() => setIsPlaying(true));
    }
  }, [spotifyPlayer, scannedUrl]);

  const getPreviewUrl = async (trackUrl: string): Promise<string | null> => {
    try {
      const trackId = trackUrl.split("/track/")[1]?.split("?")[0];
      if (!trackId) return null;

      // Usar nuestro proxy en lugar de la API de Spotify
      const response = await fetch(`/api/preview?trackId=${trackId}`);

      if (!response.ok) return null;

      const data = await response.json();
      return data.preview_url || null;
    } catch {
      return null;
    }
  };

  const handleScan = async (result: string) => {
    if (!result?.startsWith("https://open.spotify.com/")) {
      setIsError(true);
      setIsScanning(false);
      return;
    }

    setScannedUrl(result);
    setIsScanning(false);
    
    if (isFreeAccount) {
      console.log("Cuenta Free - intentando obtener preview...");
      const preview = await getPreviewUrl(result);
      
      if (preview) {
        console.log("✅ Preview encontrado - modo preview");
        setPreviewUrl(preview);
      } else {
        console.log("❌ Sin preview");
        alert("Esta canción no tiene preview.\n\nPrueba con canciones populares.");
        setScannedUrl(null);
        setIsScanning(true);
        return;
      }
      setShowReady(true);
    }
  };

  const handlePlayPause = () => {
    if (!spotifyPlayer) return;
    
    if (isPlaying) {
      spotifyPlayer.pause().then(() => setIsPlaying(false));
    } else {
      spotifyPlayer.resume().then(() => setIsPlaying(true));
    }
  };

  const handleStartPlay = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          alert('Necesitamos permiso del giroscopio');
          return;
        }
      } catch (error) {
        console.error('Error permiso:', error);
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
    setSelectedMode('normal');
    setShowModeSelection(false);
  };

  const handleModeBingo = () => {
    setSelectedMode('bingo');
    setShowModeSelection(false);
    setShowPlaylistScanner(true);
  };

  const handlePlaylistScanned = async (playlistUrl: string) => {
    try {
      // Extraer playlist ID de la URL
      const playlistId = playlistUrl.split('/playlist/')[1]?.split('?')[0];
      if (!playlistId) {
        alert('URL de playlist inválida');
        return;
      }

      // Obtener canciones de la playlist
      const response = await fetch(`/api/playlist?playlistId=${playlistId}&accessToken=${accessToken}`);
      
      if (!response.ok) {
        alert('Error al cargar la playlist. Verifica que sea pública.');
        return;
      }

      const data = await response.json();
      
      if (data.tracks.length === 0) {
        alert('Esta playlist está vacía o no tiene canciones válidas.');
        return;
      }

      setCurrentPlaylist(data.tracks);
      setShowPlaylistScanner(false);
      setShowBingoPlayer(true);
    } catch (error) {
      console.error('Error loading playlist:', error);
      alert('Error al cargar la playlist');
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
    if (spotifyPlayer) spotifyPlayer.pause();
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
    if (spotifyPlayer) spotifyPlayer.pause();
  };

  if (!playerActivated) {
    return <ActivatePlayerView onActivate={() => {
      setPlayerActivated(true);
      initializePlayer();
    }} />;
  }

  if (isInitializing) return <LoadingIcon />;
  
  if (showModeSelection) {
    return (
      <ModeSelection
        onSelectNormal={handleModeNormal}
        onSelectBingo={handleModeBingo}
      />
    );
  }
  
  if (showPlaylistScanner) {
    return (
      <PlaylistScanner
        onPlaylistScanned={handlePlaylistScanned}
        onError={() => setIsError(true)}
        onCancel={handleBackToModes}
      />
    );
  }
  
  if (showBingoPlayer) {
    return (
      <BingoPlayer
        playlist={currentPlaylist}
        onBack={handleBingoBack}
      />
    );
  }
  
  if (showReady) return <ReadyToPlay onStart={handleStartPlay} onCancel={handleBackToModes} />;
  if (showFlipAndPlay && previewUrl) return <FlipAndPlay previewUrl={previewUrl} onEnded={handleSongEnded} onCancel={handleBackToModes} />;
  if (showDone) return <SongDone onNext={resetScanner} onReset={handleBackToModes} />;
  if (isError) return <ErrorView onRetry={resetScanner} />;
  if (scannedUrl && !isFreeAccount) return <PlayingView onReset={handleBackToModes} onScanAgain={resetScanner} isPlaying={isPlaying} onPlayPause={handlePlayPause} />;

  return isScanning ? (
    <div className="w-full max-w-md rounded-lg overflow-hidden shadow-2xl shadow-[#1DB954]/20">
      <QrScanner
        onDecode={handleScan}
        onError={() => {
          setIsError(true);
          setIsScanning(false);
        }}
        scanDelay={500}
        hideCount
        audio={false}
        constraints={{ facingMode: "environment" }}
      />
    </div>
  ) : deviceId && selectedMode === 'normal' ? (
    <>
      <ScanButton onClick={() => setIsScanning(true)} />
      {isFreeAccount && (
        <p className="text-gray-400 text-sm text-center mt-4 max-w-md px-4">
          💡 Previews de 30 segundos
        </p>
      )}
      <button
        onClick={handleBackToModes}
        className="text-gray-500 hover:text-gray-300 transition-colors mt-8 text-sm"
      >
        ← Cambiar modo
      </button>
      <a className="text-[#1DB954] font-bold hover:text-[#1ed760] text-center mt-4" href="https://www.blindsongscanner.com">
        About
      </a>
    </>
  ) : (
    <LoadingIcon />
  );
}

export default Main;
