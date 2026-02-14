import { useEffect, useState } from "react";
import { ScanButton } from "./ScanButton.tsx";
import { PlayingView } from "./PlayingView.tsx";
import { ErrorView } from "./ErrorView.tsx";
import { ActivatePlayerView } from "./ActivatePlayerView.tsx";
import { ReadyToFlip } from "./ReadyToFlip.tsx";
import { WaitingForFlip } from "./WaitingForFlip.tsx";
import { AudioPreviewPlayer } from "./AudioPreviewPlayer.tsx";
import { PreviewDone } from "./PreviewDone.tsx";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { LoadingIcon } from "./icons/LoadingIcon.tsx";

interface MainProps {
  accessToken: string;
  resetTrigger: number;
  isActive: (active: boolean) => void;
}

// Detectar si estamos en Android
const isAndroid = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
};

function Main({ accessToken, resetTrigger, isActive }: MainProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerActivated, setPlayerActivated] = useState(!isAndroid());
  const [isInitializing, setIsInitializing] = useState(false);
  const [isFreeAccount, setIsFreeAccount] = useState(false);
  
  // Estados para el sistema de previews
  const [showReadyToFlip, setShowReadyToFlip] = useState(false);
  const [showWaitingForFlip, setShowWaitingForFlip] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDone, setPreviewDone] = useState(false);

  useEffect(() => {
    const active = isScanning || isError || scannedUrl || showReadyToFlip || 
                   showWaitingForFlip || isPlayingPreview || previewDone;
    isActive(active);
  }, [isScanning, isError, scannedUrl, showReadyToFlip, showWaitingForFlip, isPlayingPreview, previewDone]);

  useEffect(() => {
    if (resetTrigger > 0) {
      resetToStart();
    }
  }, [resetTrigger]);

  // Inicializar el player (solo para Premium)
  const initializePlayer = async () => {
    if (spotifyPlayer) return;

    console.log("Intentando inicializar reproductor...");
    setIsInitializing(true);

    try {
      const player = new window.Spotify.Player({
        name: "Blind Song Scanner",
        getOAuthToken: async (callback: (token: string) => void) => {
          callback(accessToken);
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Reproductor listo (Premium):", device_id);
        setDeviceId(device_id);
        setIsFreeAccount(false);
        setIsInitializing(false);
      });

      player.addListener("account_error", ({ message }) => {
        console.error("Error de cuenta (Free):", message);
        setIsFreeAccount(true);
        setDeviceId("free-account");
        setIsInitializing(false);
      });

      player.addListener("player_state_changed", (state) => {
        if (state) {
          setIsPlaying(!state.paused);
        }
      });

      const success = await player.connect();
      if (success) {
        console.log("Player conectado");
        setSpotifyPlayer(player);
      } else {
        console.log("No se pudo conectar - cuenta Free");
        setIsFreeAccount(true);
        setDeviceId("free-account");
        setIsInitializing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsFreeAccount(true);
      setDeviceId("free-account");
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (playerActivated && !isAndroid()) {
      initializePlayer();
    }
  }, [playerActivated]);

  const handleActivatePlayer = () => {
    console.log("Activación manual del reproductor");
    setPlayerActivated(true);
    initializePlayer();
  };

  // Obtener preview URL de Spotify
  const getPreviewUrl = async (trackUrl: string): Promise<string | null> => {
    try {
      const trackId = trackUrl.split("/track/")[1]?.split("?")[0];
      if (!trackId) return null;

      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      return data.preview_url || null;
    } catch (error) {
      console.error("Error obteniendo preview:", error);
      return null;
    }
  };

  // Reproducir en Premium
  useEffect(() => {
    if (spotifyPlayer && scannedUrl && deviceId && !isFreeAccount && deviceId !== "free-account") {
      const spotifyUri = scannedUrl
        .replace("https://open.spotify.com/track/", "spotify:track:")
        .split("?")[0];

      console.log("Reproduciendo (Premium):", spotifyUri);

      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [spotifyUri] }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }).then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Error al reproducir:", error);
      });
    }
  }, [spotifyPlayer, scannedUrl]);

  const handlePlayPause = () => {
    if (!spotifyPlayer) return;

    if (isPlaying) {
      spotifyPlayer.pause().then(() => {
        setIsPlaying(false);
      });
    } else {
      spotifyPlayer.resume().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleScan = async (result: string) => {
    if (result?.startsWith("https://open.spotify.com/")) {
      console.log("QR escaneado:", result);
      setScannedUrl(result);
      setIsScanning(false);
      
      // Si es cuenta Free, obtener preview y preparar giroscopio
      if (isFreeAccount) {
        console.log("Cuenta Free - obteniendo preview...");
        const preview = await getPreviewUrl(result);
        
        if (preview) {
          setPreviewUrl(preview);
          setShowReadyToFlip(true);
        } else {
          alert("Esta canción no tiene preview disponible. Prueba con otra.");
          setScannedUrl(null);
          setIsScanning(true);
        }
      }
    } else {
      setIsError(true);
      setIsScanning(false);
    }
  };

  const handleReadyToFlip = () => {
    console.log("Usuario listo - esperando que gire el móvil");
    setShowReadyToFlip(false);
    setShowWaitingForFlip(true);
  };

  const handleFlipped = () => {
    console.log("¡Móvil girado! Reproduciendo preview...");
    setShowWaitingForFlip(false);
    setIsPlayingPreview(true);
  };

  const handlePreviewEnded = () => {
    console.log("Preview terminado");
    setIsPlayingPreview(false);
    setPreviewDone(true);
  };

  const handlePreviewError = () => {
    console.error("Error reproduciendo preview");
    setIsPlayingPreview(false);
    alert("Error reproduciendo la canción. Intenta de nuevo.");
    resetToStart();
  };

  const handleError = (error: Error) => {
    console.error("Error del escáner:", error);
    setIsError(true);
    setIsScanning(false);
  };

  const resetScanner = () => {
    setScannedUrl(null);
    setIsError(false);
    setIsScanning(true);
    setIsPlaying(false);
    setShowReadyToFlip(false);
    setShowWaitingForFlip(false);
    setIsPlayingPreview(false);
    setPreviewUrl(null);
    setPreviewDone(false);
    if (spotifyPlayer) {
      spotifyPlayer.pause();
    }
  };

  const resetToStart = () => {
    setScannedUrl(null);
    setIsError(false);
    setIsScanning(false);
    setIsPlaying(false);
    setShowReadyToFlip(false);
    setShowWaitingForFlip(false);
    setIsPlayingPreview(false);
    setPreviewUrl(null);
    setPreviewDone(false);
    if (spotifyPlayer) {
      spotifyPlayer.pause();
    }
  };

  // Pantalla de activación (solo Android)
  if (!playerActivated) {
    return <ActivatePlayerView onActivate={handleActivatePlayer} />;
  }

  // Loading mientras inicializa
  if (isInitializing) {
    return <LoadingIcon />;
  }

  // Pantalla "¿Listo para girar?" (Free)
  if (showReadyToFlip) {
    return (
      <ReadyToFlip
        onReady={handleReadyToFlip}
        onCancel={resetToStart}
        isFree={isFreeAccount}
      />
    );
  }

  // Esperando que gire el móvil (Free)
  if (showWaitingForFlip) {
    return (
      <WaitingForFlip
        onFlipped={handleFlipped}
        onCancel={resetToStart}
      />
    );
  }

  // Reproduciendo preview (Free)
  if (isPlayingPreview && previewUrl) {
    return (
      <AudioPreviewPlayer
        previewUrl={previewUrl}
        onEnded={handlePreviewEnded}
        onError={handlePreviewError}
      />
    );
  }

  // Preview terminado (Free)
  if (previewDone) {
    return (
      <PreviewDone
        onScanAgain={resetScanner}
        onReset={resetToStart}
      />
    );
  }

  if (isError) {
    return <ErrorView onRetry={resetScanner} />;
  }

  // Controles de reproducción (Premium)
  if (scannedUrl && !isFreeAccount) {
    return (
      <PlayingView
        onReset={resetToStart}
        onScanAgain={resetScanner}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
    );
  }

  return isScanning ? (
    <div className="w-full max-w-md rounded-lg overflow-hidden shadow-2xl shadow-[#1DB954]/20">
      <QrScanner
        onDecode={handleScan}
        onError={handleError}
        scanDelay={500}
        hideCount
        audio={false}
        constraints={{
          facingMode: "environment",
        }}
      />
    </div>
  ) : deviceId !== null ? (
    <>
      <ScanButton onClick={() => setIsScanning(true)} />
      {isFreeAccount && (
        <p className="text-gray-400 text-sm text-center mt-4 max-w-md px-4">
          💡 Cuenta Free: Previews de 30 segundos
        </p>
      )}
      <a
        className="text-[#1DB954] font-bold hover:text-[#1ed760] text-center mt-16"
        href="https://www.blindsongscanner.com"
      >
        About
      </a>
    </>
  ) : (
    <LoadingIcon />
  );
}

export default Main;
