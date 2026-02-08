import { useEffect, useState } from "react";
import { ScanButton } from "./ScanButton.tsx";
import { PlayingView } from "./PlayingView.tsx";
import { ErrorView } from "./ErrorView.tsx";
import { ActivatePlayerView } from "./ActivatePlayerView.tsx";
import { CountdownView } from "./CountdownView.tsx";
import { FreeAccountPlayedView } from "./FreeAccountPlayedView.tsx";
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
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerActivated, setPlayerActivated] = useState(!isAndroid());
  const [isInitializing, setIsInitializing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [freeAccountPlayed, setFreeAccountPlayed] = useState(false);
  const [isFreeAccount, setIsFreeAccount] = useState(false);

  useEffect(() => {
    if (isScanning || isError || scannedUrl || showCountdown || freeAccountPlayed) {
      isActive(true);
    } else {
      isActive(false);
    }
  }, [isScanning, isError, scannedUrl, showCountdown, freeAccountPlayed]);

  useEffect(() => {
    if (resetTrigger > 0) {
      resetToStart();
    }
  }, [resetTrigger]);

  // Inicializar el player (intentarlo, si falla es Free)
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

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device offline", device_id);
        setIsInitializing(false);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error("Error de inicialización:", message);
        setIsInitializing(false);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("Error de autenticación:", message);
        setIsInitializing(false);
      });

      player.addListener("account_error", ({ message }) => {
        console.error("Error de cuenta (probablemente Free):", message);
        // Cuenta Free detectada
        setIsFreeAccount(true);
        setDeviceId("free-account"); // Valor dummy para mostrar botón
        setIsInitializing(false);
      });

      player.addListener("playback_error", ({ message }) => {
        console.error("Error de reproducción:", message);
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
        console.log("No se pudo conectar - probablemente cuenta Free");
        setIsFreeAccount(true);
        setDeviceId("free-account");
        setIsInitializing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      // Asumir cuenta Free y continuar
      setIsFreeAccount(true);
      setDeviceId("free-account");
      setIsInitializing(false);
    }
  };

  // En iOS/desktop inicializar automáticamente
  useEffect(() => {
    if (playerActivated && !isAndroid()) {
      initializePlayer();
    }
  }, [playerActivated]);

  // Manejar activación manual (Android)
  const handleActivatePlayer = () => {
    console.log("Activación manual del reproductor");
    setPlayerActivated(true);
    initializePlayer();
  };

  // Reproducir en cuentas Premium
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

  // Abrir en Spotify app para cuentas Free
  const openInSpotifyApp = (url: string) => {
    const trackId = url.split("/track/")[1]?.split("?")[0];
    if (trackId) {
      const spotifyUri = `spotify:track:${trackId}`;
      console.log("Abriendo en Spotify:", spotifyUri);
      
      // Abrir en la app de Spotify
      window.location.href = spotifyUri;
      
      // Backup
      setTimeout(() => {
        window.open(url, "_blank");
      }, 1000);
    }
  };

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

  const handleScan = (result: string) => {
    if (result?.startsWith("https://open.spotify.com/")) {
      console.log("QR escaneado:", result);
      setScannedUrl(result);
      setIsScanning(false);
      
      // Si es cuenta Free, mostrar countdown
      if (isFreeAccount) {
        console.log("Cuenta Free - mostrando countdown");
        setShowCountdown(true);
      }
    } else {
      setIsError(true);
      setIsScanning(false);
    }
  };

  const handleCountdownComplete = () => {
    console.log("Countdown completado");
    setShowCountdown(false);
    if (scannedUrl) {
      openInSpotifyApp(scannedUrl);
      setFreeAccountPlayed(true);
    }
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
    setShowCountdown(false);
    setFreeAccountPlayed(false);
    if (spotifyPlayer) {
      spotifyPlayer.pause();
    }
  };

  const resetToStart = () => {
    setScannedUrl(null);
    setIsError(false);
    setIsScanning(false);
    setIsPlaying(false);
    setShowCountdown(false);
    setFreeAccountPlayed(false);
    if (spotifyPlayer) {
      spotifyPlayer.pause();
    }
  };

  // Mostrar pantalla de activación si no está activado (solo Android)
  if (!playerActivated) {
    return <ActivatePlayerView onActivate={handleActivatePlayer} />;
  }

  // Mostrar loading solo mientras inicializa
  if (isInitializing) {
    return <LoadingIcon />;
  }

  // Mostrar countdown para cuentas Free
  if (showCountdown) {
    return <CountdownView onComplete={handleCountdownComplete} />;
  }

  // Mostrar pantalla después de reproducir en cuenta Free
  if (freeAccountPlayed) {
    return (
      <FreeAccountPlayedView
        onScanAgain={resetScanner}
        onReset={resetToStart}
      />
    );
  }

  if (isError) {
    return <ErrorView onRetry={resetScanner} />;
  }

  // Mostrar controles de reproducción para cuentas Premium
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
          💡 Cuenta Free detectada - Las canciones se abrirán en Spotify
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
