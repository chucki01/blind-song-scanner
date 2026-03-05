import { Header } from "./components/Header.tsx";
import { HomeScreen } from "./components/HomeScreen.tsx";
import { useEffect, useState } from "react";
import Main from "./components/Main.tsx";

function App() {
  const [started, setStarted] = useState(false);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [showSmallHeader, setShowSmallHeader] = useState(false);

  return (
    <>
      {/* Background rings */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute w-64 h-64 rounded-full ring-pulse" style={{ border: "1px solid rgba(202,255,0,0.06)" }} />
        <div className="absolute w-96 h-96 rounded-full ring-pulse" style={{ border: "1px solid rgba(202,255,0,0.04)" }} />
        <div className="absolute w-[32rem] h-[32rem] rounded-full ring-pulse" style={{ border: "1px solid rgba(202,255,0,0.02)" }} />
      </div>

      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative"
        style={{ background: "#080808", zIndex: 1 }}
      >
        <div className="w-full max-w-sm flex flex-col items-center">
          {started && (
            <Header
              onLogoClick={() => {
                setResetTrigger((prev) => prev + 1);
                setStarted(false);
              }}
              small={showSmallHeader}
            />
          )}

          {!started ? (
            <HomeScreen onStart={() => setStarted(true)} onInstructions={() => {}} />
          ) : (
            <Main
              accessToken=""
              resetTrigger={resetTrigger}
              isActive={(active) => setShowSmallHeader(active)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
