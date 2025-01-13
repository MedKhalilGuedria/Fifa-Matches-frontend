import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './H2H.css';

const H2H = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [players, setPlayers] = useState([]);
  const [h2hResults, setH2hResults] = useState(null);

  useEffect(() => {
    // Fetch players from the backend
    const fetchPlayers = async () => {
      try {
        const res = await axios.get('https://fifa-matches-results.onrender.com/api/players');
        setPlayers(res.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  const handleFetchH2H = async () => {
    if (!player1 || !player2) {
      alert('Please select both players!');
      return;
    }
    try {
      const res = await axios.get(
        `https://fifa-matches-results.onrender.com/api/h2h?player1=${player1}&player2=${player2}`
      );
      setH2hResults(res.data);
    } catch (error) {
      console.error('Error fetching H2H results:', error);
    }
  };

  return (
    <div className="h2h-container">
      <h1>Head-to-Head (H2H) Results</h1>
      <div className="h2h-form">
        <select
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="h2h-select"
        >
          <option value="">Select Player 1</option>
          {players.map((player) => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>

        <select
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="h2h-select"
        >
          <option value="">Select Player 2</option>
          {players.map((player) => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>

        <button onClick={handleFetchH2H} className="h2h-button">
          Fetch H2H Results
        </button>
      </div>

      {h2hResults && (
        <div className="h2h-results">
          <h2>Results:</h2>
          <p>
            Head-to-Head: <strong>{player1}</strong> vs <strong>{player2}</strong>
          </p>
          <p>Total Matches: {h2hResults.totalMatches}</p>
          <p>{player1} Wins: {h2hResults.player1Wins}</p>
          <p>{player2} Wins: {h2hResults.player2Wins}</p>
          <p>Draws: {h2hResults.draws}</p>
          <p>{player1} Goals: {h2hResults.player1Goals}</p>
          <p>{player2} Goals: {h2hResults.player2Goals}</p>

          <h3>Match History:</h3>
          <ul>
            {h2hResults.matches.map((match, index) => (
              <li key={index}>
                {match.player1} {match.score1} - {match.score2} {match.player2} 
                ({new Date(match.date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default H2H;
