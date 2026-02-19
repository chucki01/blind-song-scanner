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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 p-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">📋 Canciones Reproducidas</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {songs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-gray-400">
                Aún no se han reproducido canciones
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-4 text-center">
                Total: {songs.length} canción{songs.length !== 1 ? 'es' : ''}
              </p>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="bg-gray-800 rounded-lg p-3 border-l-4 border-purple-400"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">
                          {song.name}
                        </h3>
                        <p className="text-gray-400 text-xs truncate">
                          {song.artist}
                        </p>
                      </div>
                      <div className="text-right ml-3">
                        <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          #{index + 1}
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {song.playedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 text-center">
          <button
            onClick={onClose}
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
