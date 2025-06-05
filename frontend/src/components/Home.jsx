import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App';

function Home() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name to continue");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const room = await fetch("http://localhost:3000/room", {
        method: "POST",
      });

      const data = await room.json();

      await fetch(`http://localhost:3000/room/${data.roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName }),
      });

      navigate(`/room/${data.roomId}/lobby?name=${encodeURIComponent(playerName)}`);
    } catch (err) {
      setError("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name to continue");
      return;
    }

    if (!roomId.trim()) {
      setError("Please enter a room ID to join");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/room/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join room");
      }

      navigate(`/room/${roomId}/lobby?name=${encodeURIComponent(playerName)}`);
    } catch (err) {
      setError(err.message || "Failed to join room. Please check the room ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-red-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 bg-red-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-24 left-1/4 w-48 h-48 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-12 w-36 h-36 bg-indigo-500 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        <div className="max-w-lg mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6 ">🎭</div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Truth or Dare
            </h1>
            <p className="text-gray-300 text-lg">
              Ready for some wild questions and crazy challenges?
            </p>
            <div className="flex justify-center gap-4 mt-4 text-2xl">
              <span className="animate-pulse">🔥</span>
              <span className="animate-pulse">💀</span>
              <span className="animate-pulse">⚡</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-black/30 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 backdrop-blur-md border border-red-500/50 rounded-xl p-4 text-red-200 text-center mb-6">
                <span className="text-xl mr-2">⚠️</span>
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="mb-8">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                👤 Enter Your Name
              </label>
              <input
                className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="What should we call you?"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Create Room Section */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                    🎪
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-yellow-400">Host a New Game</h2>
                    <p className="text-gray-400 text-sm">Start fresh with your friends</p>
                  </div>
                </div>
                <button
                  onClick={createRoom}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/25"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Room...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      🚀 Create Room
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <span className="text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>

            {/* Join Room Section */}
            <div>
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">Join Existing Game</h2>
                    <p className="text-gray-400 text-sm">Got a room code from a friend?</p>
                  </div>
                </div>
                <input
                  className="w-full p-4 mb-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter Room Code (e.g., ABC123)"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  disabled={loading}
                />
                <button
                  onClick={joinRoom}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Joining Room...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      🎮 Join Room
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400">
            <p className="text-sm">
              🔥 Dare to be bold • 💯 Truth seekers welcome • 🎉 Fun guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;