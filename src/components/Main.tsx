import { useEffect, useState } from "react";
import { ScanButton } from "./ScanButton.tsx";
import { PlayingView } from "./PlayingView.tsx";
import { ErrorView } from "./ErrorView.tsx";
import { ActivatePlayerView } from "./ActivatePlayerView.tsx";
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
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerActivated, setPlayerActivated] = useState(!isAndroid());
  const [isInitializing, setIsInitializing] = useState(false);
  const [isFreeAccount, setIsFreeAccount] = useState(false);
  
  const [showReady, setShowReady] = useState(false);
  const [showFlipAndPlay, setShowFlipAndPlay] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    const active = isScanning || isError || scannedUrl || showReady || showFlipAndPlay || showDone;
    isActive(active);
  }, [isScanning, isError, scannedUrl, showReady, showFlipAndPlay, showDone]);

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
      const preview = await getPreviewUrl(result);
      
      if (preview) {
        setPreviewUrl(preview);
        setShowReady(true);
      } else {
        alert("Esta canción no tiene preview.\n\nPrueba con canciones populares.");
        setScannedUrl(null);
        setIsScanning(true);
      }
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
    if (spotifyPlayer) spotifyPlayer.pause();
  };

  if (!playerActivated) {
    return <ActivatePlayerView onActivate={() => {
      setPlayerActivated(true);
      initializePlayer();
    }} />;
  }

  if (isInitializing) return <LoadingIcon />;
  if (showReady) return <ReadyToPlay onStart={handleStartPlay} onCancel={resetToStart} />;
  if (showFlipAndPlay && previewUrl) return <FlipAndPlay previewUrl={previewUrl} onEnded={handleSongEnded} onCancel={resetToStart} />;
  if (showDone) return <SongDone onNext={resetScanner} onReset={resetToStart} />;
  if (isError) return <ErrorView onRetry={resetScanner} />;
  if (scannedUrl && !isFreeAccount) return <PlayingView onReset={resetToStart} onScanAgain={resetScanner} isPlaying={isPlaying} onPlayPause={handlePlayPause} />;

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
  ) : deviceId ? (
    <>
      <ScanButton onClick={() => setIsScanning(true)} />
      {isFreeAccount && (
        <p className="text-gray-400 text-sm text-center mt-4 max-w-md px-4">
          💡 Previews de 30 segundos
        </p>
      )}
      <a className="text-[#1DB954] font-bold hover:text-[#1ed760] text-center mt-16" href="https://www.blindsongscanner.com">
        About
      </a>
    </>
  ) : (
    <LoadingIcon />
  );
}

export default Main;
