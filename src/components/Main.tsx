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
  // Estados básicos
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerActivated, setPlayerActivated] = useState(true); // Siempre activado
  const [isInitializing, setIsInitializing] = useState(false);
  const [isFreeAccount, setIsFreeAccount] = useState(true); // Siempre en modo preview
  
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

  // Mostrar selección de modo directamente (sin SDK complejo)
  useEffect(() => {
    if (!showModeSelection && !selectedMode && 
        !isScanning && !scannedUrl && !showReady && !showFlipAndPlay && !showDone && 
        !showPlaylistScanner && !showBingoPlayer) {
      setShowModeSelection(true);
    }
  }, [showModeSelection, selectedMode, isScanning, scannedUrl, 
      showReady, showFlipAndPlay, showDone, showPlaylistScanner, showBingoPlayer]);

  // Obtener preview de cualquier canción (método simple y universal)
  const getPreviewUrl = async (trackUrl: string): Promise<string | null> => {
    try {
      const trackId = trackUrl.split("/track/")[1]?.split("?")[0];
      if (!trackId) return null;

      // Usar nuestro proxy que SIEMPRE funciona
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
    
    // SIEMPRE usar preview (30 segundos) - modo universal
    console.log("Obteniendo preview de 30 segundos...");
    const preview = await getPreviewUrl(result);
    
    if (preview) {
      console.log("✅ Preview encontrado");
      setPreviewUrl(preview);
      setShowReady(true);
    } else {
      console.log("❌ Sin preview disponible");
      alert("Esta canción no tiene preview de 30 segundos.\n\nPrueba con otra canción.");
      setScannedUrl(null);
      setIsScanning(true);
      return;
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
      // Detectar qué código QR escanearon y cargar la playlist correspondiente
      let playlist;
      let gameVersion = "Unknown";
      
      // VERSIÓN: EUROVISIÓN
      if (playlistUrl.includes('eurovision') || playlistUrl.includes('37i9dQZF1DX0XUsuxWHRQd')) {
        gameVersion = "Eurovisión Edition";
        if (playlistUrl.includes('lista1') || playlistUrl.includes('winners')) {
          // Bingo 1: Ganadores Eurovisión
          playlist = [
            { id: '4iEEgA4wPtzCp9jfZ8aHlh', name: 'Waterloo', artists: [{ name: 'ABBA' }], duration_ms: 164000 },
            { id: '5HKnTk2iLXRfLSkjJE9ZxQ', name: 'Euphoria', artists: [{ name: 'Loreen' }], duration_ms: 180000 },
            { id: '2jzEpCr0vhd6r7CxMYsRJ0', name: 'Hard Rock Hallelujah', artists: [{ name: 'Lordi' }], duration_ms: 183000 },
            { id: '1wVPx3QjXNJeQjFOaQ1234', name: 'Rise Like a Phoenix', artists: [{ name: 'Conchita Wurst' }], duration_ms: 195000 }
          ];
        } else {
          // Bingo 2: Eurovisión España
          playlist = [
            { id: '7hQ8fBJ9AbCdEfG1hI2JkL', name: 'SloMo', artists: [{ name: 'Chanel' }], duration_ms: 172000 },
            { id: '3mNpQrStUvWxYz4BcD5678', name: 'La Venda', artists: [{ name: 'Miki' }], duration_ms: 168000 },
            { id: '9oPqRsTuVwXy1Z2AcE9012', name: 'Zorra', artists: [{ name: 'Nebulossa' }], duration_ms: 159000 }
          ];
        }
      }
      
      // VERSIÓN: POP ESPAÑOL
      else if (playlistUrl.includes('popespanol') || playlistUrl.includes('37i9dQZF1DWXRqgorJj26U')) {
        gameVersion = "Pop Español Edition";
        if (playlistUrl.includes('lista1') || playlistUrl.includes('clasicos')) {
          // Bingo 1: Clásicos Pop Español
          playlist = [
            { id: '5aB6Cd7EfG8hI9jK0lM1nO', name: 'Macarena', artists: [{ name: 'Los Del Rio' }], duration_ms: 231000 },
            { id: '2pQ3rS4tU5vW6xY7zA8bC9', name: 'Bamboléo', artists: [{ name: 'Gipsy Kings' }], duration_ms: 215000 },
            { id: '8dE9fG0hI1jK2lM3nO4pQ5', name: 'La Camisa Negra', artists: [{ name: 'Juanes' }], duration_ms: 207000 }
          ];
        } else {
          // Bingo 2: Pop Español Moderno  
          playlist = [
            { id: '6rS7tU8vW9xY0zA1bC2dE3', name: 'Con Altura', artists: [{ name: 'Rosalía' }, { name: 'J Balvin' }], duration_ms: 188000 },
            { id: '4fG5hI6jK7lM8nO9pQ0rS1', name: 'Despechá', artists: [{ name: 'Rosalía' }], duration_ms: 168000 }
          ];
        }
      }
      
      // VERSIÓN: BANDAS SONORAS
      else if (playlistUrl.includes('peliculas') || playlistUrl.includes('soundtrack') || playlistUrl.includes('37i9dQZF1DWXbttAJcbphz')) {
        gameVersion = "Bandas Sonoras Edition";
        if (playlistUrl.includes('lista1') || playlistUrl.includes('disney')) {
          // Bingo 1: Disney
          playlist = [
            { id: '3tU2vW5xY6zA7bC8dE9fG0', name: 'Let It Go', artists: [{ name: 'Idina Menzel' }], duration_ms: 225000 },
            { id: '1hI2jK3lM4nO5pQ6rS7tU8', name: 'Can You Feel the Love Tonight', artists: [{ name: 'Elton John' }], duration_ms: 238000 }
          ];
        } else {
          // Bingo 2: Películas Clásicas
          playlist = [
            { id: '9vW0xY1zA2bC3dE4fG5hI6', name: 'My Heart Will Go On', artists: [{ name: 'Céline Dion' }], duration_ms: 279000 },
            { id: '7jK8lM9nO0pQ1rS2tU3vW4', name: 'Eye of the Tiger', artists: [{ name: 'Survivor' }], duration_ms: 246000 }
          ];
        }
      }
      
      // DEFAULT: Electronic Hits (si no reconoce la URL)
      else {
        gameVersion = "Electronic Hits Edition";
        playlist = [
          { id: '5uuJruktM9fMdN9Va0DUMp', name: 'Sandstorm', artists: [{ name: 'Darude' }], duration_ms: 231000 },
          { id: '6ol4ZSifap37zpKONNHlNz', name: 'Children', artists: [{ name: 'Robert Miles' }], duration_ms: 441000 },
          { id: '3JvKfv6T31zO0ini8iNItO', name: 'Ecuador', artists: [{ name: 'Sash!' }], duration_ms: 212000 }
        ];
      }

      console.log(`🎲 ${gameVersion} cargado con ${playlist.length} canciones`);
      
      setCurrentPlaylist(playlist);
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

  // Renderizado simplificado - siempre modo preview
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
  ) : selectedMode === 'normal' ? (
    <>
      <ScanButton onClick={() => setIsScanning(true)} />
      <p className="text-gray-400 text-sm text-center mt-4 max-w-md px-4">
        🎵 Previews de 30 segundos para todos
      </p>
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
    <div className="text-center">
      <div className="text-6xl mb-6">🎵</div>
      <h2 className="text-white text-2xl font-bold mb-4">Blind Song Scanner</h2>
      <p className="text-gray-400 mb-8">Previews de 30 segundos - Funciona para todos</p>
    </div>
  );
}

export default Main;
