import { Header } from "./components/Header.tsx";
import { SpotifyLogin } from "./components/SpotifyLogin.tsx";
import { checkSpotifyAccessToken, refreshToken } from "./util/spotify.ts";
import { useEffect, useState } from "react";
import Main from "./components/Main.tsx";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTimeout, setRefreshTimeout] = useState<number | null>(null);
  const [isSpotifySDKReady, setIsSpotifySDKReady] = useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [showSmallHeader, setShowSmallHeader] = useState(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const newCode = queryParameters.get("code");
  if (newCode) {
    window.localStorage.setItem("spotifyCode", newCode);
    window.history.replaceState({}, document.title, "/");
  }

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsSpotifySDKReady(true);
    };
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    const reloadTokens = () => {
      const expiresAt = window.localStorage.getItem("spotifyAccessTokenExpiresAt");
      const accessToken = window.localStorage.getItem("spotifyAccessToken");
      setAccessToken(accessToken);
      if (expiresAt) {
        const timeoutMs = parseInt(expiresAt) - Date.now();
        if (refreshTimeout) clearTimeout(refreshTimeout);
        const newTimeout = setTimeout(() => {
          refreshToken().then(reloadTokens);
        }, timeoutMs);
        setRefreshTimeout(newTimeout);
      }
    };
    checkSpotifyAccessToken().then(() => {
      reloadTokens();
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {/* Background rings decoration */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute w-64 h-64 rounded-full ring-pulse" style={{ border: "1px solid rgba(202,255,0,0.06)" }} />
        <div className="absolute w-96 h-96 rounded-full ring-pulse" style={{ border: "1px solid rgba(202,255,0,0.04)" }} />
        <div className="absolute w-[32rem] h-[32rem] rounded-full ring-pulse" style={{ border: "1px solid rgba(202,255,0,0.02)" }} />
      </div>

      <div
        className="min-h-screen flex flex-col items-center justify-start pt-12 p-4 relative"
        style={{ background: "#080808", zIndex: 1 }}
      >
        <Header
          onLogoClick={() => setResetTrigger((prev) => prev + 1)}
          small={showSmallHeader}
        />

        {!isLoading && !accessToken ? <SpotifyLogin /> : null}

        {accessToken && isSpotifySDKReady ? (
          <Main
            accessToken={accessToken}
            resetTrigger={resetTrigger}
            isActive={(active) => setShowSmallHeader(active)}
          />
        ) : null}
      </div>
    </>
  );
}

export default App;
