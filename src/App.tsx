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
        <div className="absolute w-64 h-64 rounded-full ring-pulse" style={{ border: "1px solid rgba(232,23,93,0.07)" }} />
        <div className="absolute w-96 h-96 rounded-full ring-pulse" style={{ border: "1px solid rgba(232,23,93,0.05)" }} />
        <div className="absolute w-[32rem] h-[32rem] rounded-full ring-pulse" style={{ border: "1px solid rgba(232,23,93,0.03)" }} />
      </div>

      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative"
        style={{ background: "#F8F8F8", zIndex: 1 }}
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
