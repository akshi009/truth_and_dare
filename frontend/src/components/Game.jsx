import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function Game() {
    const [gameState, setGameState] = useState(null);
    const BASE_URL = import.meta.env.VITE_API_BACKEND_URL;
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [prompt, setPrompt] = useState('');
    const { roomId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const playerName = queryParams.get('name');
  
    useEffect(() => {
      const fetchGameState = async () => {
        const res = await fetch(`${BASE_URL}/room/${roomId}`);
        const data = await res.json();
        setGameState(data);
        const player = data.players[data.currentTurn];
        setCurrentPlayer(player);
      };
      fetchGameState();
    }, [roomId]);

    // Update currentPlayer whenever gameState changes
    useEffect(() => {
      if (gameState && gameState.players) {
        const player = gameState.players[gameState.currentTurn];
        setCurrentPlayer(player);
      }
    }, [gameState]);
  
    const select = async (type) => {
      const res = await fetch(`${BASE_URL}/prompts?type=${type}`);
      const data = await res.json();
      setPrompt(data.prompt);
    };

    const pass = async () => {
        const res = await fetch(`${BASE_URL}/room/${roomId}/next`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'truth' }),
        });
        const data = await res.json();
        setPrompt('');
        
        // Fetch updated game state to get latest scores
        const updatedRes = await fetch(`${BASE_URL}/room/${roomId}`);
        const updatedData = await updatedRes.json();
        setGameState(updatedData);
    }
  
    const goToNextTurn = async () => {
      // Award 1 point to the current player BEFORE moving to next turn
      if (currentPlayer) {
        await fetch(`${BASE_URL}/room/${roomId}/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            playerId: currentPlayer.playerId, 
            points: 1 
          }),
        });
      }

      // Then move to next turn
      const res = await fetch(`${BASE_URL}/room/${roomId}/next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'truth' }),
      });
      const data = await res.json();
      setPrompt('');
      
      // Fetch updated game state to get both new turn and updated scores
      const updatedRes = await fetch(`${BASE_URL}/room/${roomId}`);
      const updatedData = await updatedRes.json();
      setGameState(updatedData);
    };
  
    if (!gameState) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-red-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-spin">🎲</div>
                    <p className="text-white text-xl">Loading game...</p>
                </div>
            </div>
        );
    }
  
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-red-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500 rounded-full blur-lg animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-40 right-10 w-28 h-28 bg-indigo-500 rounded-full blur-xl animate-bounce"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
                {/* Header Section */}
                <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                            It's {currentPlayer?.playerName}'s turn!
                        </h2>
                    <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                        <span className="text-sm opacity-75">Room: {roomId}</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm opacity-75">Live Game</span>
                    </div>
                </div>

                {/* Current Player Turn
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-400/30 rounded-2xl p-6 shadow-2xl text-center">
                        <div className="text-6xl mb-4">🎯</div>
                        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                            It's {currentPlayer?.playerName}'s turn!
                        </h2>
                        <p className="text-gray-300">Choose your challenge wisely...</p>
                    </div>
                </div> */}

                 {/* Game Action Area */}
                 <div className="max-w-xl mx-auto">
                    {!prompt ? (
                        <div className="bg-black/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                            <div className="text-center mb-8">
                                <div className="text-5xl mb-4">🤔</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Make Your Choice</h3>
                                <p className="text-gray-400">What will it be this time?</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <button 
                                    onClick={() => select('truth')}
                                    className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 p-6 rounded-2xl text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                                >
                                    <div className="text-4xl mb-3 group-hover:animate-bounce">🧠</div>
                                    <div>TRUTH</div>
                                    <div className="text-sm opacity-75 mt-1">Reveal secrets</div>
                                </button>
                                <button 
                                    onClick={() => select('dare')}
                                    className="group bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 p-6 rounded-2xl text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
                                >
                                    <div className="text-4xl mb-3 group-hover:animate-bounce">🔥</div>
                                    <div>DARE</div>
                                    <div className="text-sm opacity-75 mt-1">Take the challenge</div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-black/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="text-4xl mb-4">💫</div>
                                <h3 className="text-xl font-bold text-white mb-4">Your Challenge:</h3>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border border-purple-400/50 rounded-2xl p-6 mb-8">
                                <p className="text-lg text-white leading-relaxed text-center">
                                    {prompt}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={goToNextTurn}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-4 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                                >
                                    <span>✅</span>
                                    <span>Completed!</span>
                                </button>
                                <button 
                                    onClick={pass}
                                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 py-4 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span>❌</span>
                                    <span>Pass</span>
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <p className="text-gray-400 text-sm">
                                    Complete the challenge to earn a point! 🏆
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Players & Scores */}
                <div className="max-w-4xl mx-auto mt-8">
                    <div className="bg-black/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            🏆 Leaderboard
                        </h3>
                        <div className="grid gap-3">
                            {gameState.players.map((player, index) => (
                                <div 
                                    key={player.playerId} 
                                    className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${
                                        gameState.currentTurn === index 
                                            ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-400/50 transform ' 
                                            : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                                        gameState.currentTurn === index 
                                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium text-lg ${
                                            gameState.currentTurn === index ? 'text-yellow-300' : 'text-white'
                                        }`}>
                                            {player.playerName}
                                            {gameState.currentTurn === index && <span className="ml-2">🎲</span>}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {gameState.currentTurn === index ? 'Current turn' : 'Waiting...'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-yellow-400">
                                            {gameState.scores[player.playerId] || 0}
                                        </div>
                                        <div className="text-xs text-gray-400">points</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

               

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 text-sm">
                    <p>May the boldest player win! 🎮</p>
                </div>
            </div>
        </div>
    );
}
  
export default Game;