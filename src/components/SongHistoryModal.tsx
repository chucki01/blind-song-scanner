import React from "react";

interface Song {
  id: string;
  name: string;
  artist: string;
  playedAt: string;
}

interface SongHistoryModalProps {
  songs: Song[];
  isOpen: boolean;
  onClose: () => void;
}

export const SongHistoryModal: React.FC<SongHistoryModalProps> = ({
  songs,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl overflow-hidden"
        style={{ background: "#F8F8F8", border: "1px solid rgba(232,23,93,0.12)", maxHeight: "80vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h2 style={{ fontFamily: "'Russo One', sans-serif", fontSize: "18px", color: "#1B4F9B" }}>
              CANCIONES SONADAS
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.3)" }}>
              {songs.length} canción{songs.length !== 1 ? "es" : ""} reproducida{songs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.4)", fontSize: "14px" }}>
            ✕
          </button>
        </div>

        <div className="mx-5 h-px" style={{ background: "rgba(232,23,93,0.1)" }} />

        {/* List */}
        <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "55vh", WebkitOverflowScrolling: "touch" }}>
          {songs.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🎵</div>
              <p className="text-sm" style={{ color: "rgba(0,0,0,0.3)" }}>
                Aún no hay canciones reproducidas
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {[...songs].reverse().map((song, index) => (
                <div key={song.id + index}
                  className="flex items-center gap-3 rounded-2xl p-3"
                  style={{ background: "#EFEFEF", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: index === 0 ? "#E8175D" : "rgba(232,23,93,0.1)",
                      color: index === 0 ? "#fff" : "#E8175D",
                      fontFamily: "'Russo One', sans-serif",
                    }}>
                    {songs.length - index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "#111111" }}>
                      {song.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "rgba(0,0,0,0.4)" }}>
                      {song.artist}
                    </p>
                  </div>
                  <p className="text-xs flex-shrink-0" style={{ color: "rgba(0,0,0,0.25)" }}>
                    {song.playedAt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 pt-3">
          <button onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold tracking-wide transition-all hover:opacity-80"
            style={{
              background: "rgba(27,79,155,0.07)",
              border: "1.5px solid rgba(27,79,155,0.18)",
              color: "#1B4F9B",
              fontFamily: "'Russo One', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.1em",
            }}>
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
