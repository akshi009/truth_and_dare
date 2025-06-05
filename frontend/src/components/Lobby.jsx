import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function Lobby() {
  const { roomId } = useParams();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const playerName = queryParams.get('name');

  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch(`${BASE_URL}/room/${roomId}/players`);
        if (!res.ok) throw new Error('Failed to fetch players');
        const data = await res.json();
        setPlayers(data.players);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchPlayers();
    
    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, [roomId]);


  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Room ID: ' + roomId);
    }
  };

  const startGame = () => {
    if (players.length < 2) {
      alert('Need at least 2 players to start the game!');
      return;
    }
    // Navigate to game (you'll implement this later)
    navigate(`/room/${roomId}/game?name=${encodeURIComponent(playerName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-red-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-indigo-500 rounded-full blur-xl animate-bounce"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Truth or Dare
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
            <span className="text-sm opacity-75">Game Lobby</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm opacity-75">Live</span>
          </div>
        </div>

        {/* Room ID Section */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-black/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Room Code</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl font-mono font-bold text-yellow-400 tracking-wider">
                  {roomId}
                </span>
                <button 
                  onClick={copyRoomId}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <p className="text-gray-300">
                Welcome, <span className="text-yellow-400 font-semibold">{playerName}</span>! 🎭
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-red-900/50 backdrop-blur-md border border-red-500/50 rounded-xl p-4 text-red-200 text-center">
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* Players Section */}
        <div className="max-w-2xl mx-auto mb-8 flex-1">
          <div className="bg-black/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                👥 Players
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {players.length}
                </span>
              </h3>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Auto-updating
              </div>
            </div>

            {players.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎲</div>
                <p className="text-gray-400">Waiting for players to join...</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {players.map((player, index) => (
                  <div 
                    key={player.playerId} 
                    className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 flex items-center gap-4 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-lg">{player.playerName}</p>
                      <p className="text-gray-400 text-sm">Ready to play</p>
                    </div>
                    <div className="text-green-400">
                      ✓
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-4">
          <button 
            onClick={startGame}
            disabled={players.length < 2}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              players.length >= 2 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25' 
                : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
            }`}
          >
            {players.length >= 2 ? (
              <span className="flex items-center justify-center gap-2">
                🎮 Start Game
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ⏳ Need {2 - players.length} more player{2 - players.length !== 1 ? 's' : ''}
              </span>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              📤 Share the room code with friends to invite them!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Get ready for some wild truths and daring challenges! 🔥</p>
        </div>
      </div>
    </div>
  );
}

export default Lobby;