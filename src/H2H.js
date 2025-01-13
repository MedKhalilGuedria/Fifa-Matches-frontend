import React, { useState } from 'react';
import axios from 'axios';
import './H2H.css';

const H2H = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [h2hResults, setH2hResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!player1 || !player2) return;

    const res = await axios.get(
      `https://fifa-matches-results.onrender.com/api/h2h?player1=${player1}&player2=${player2}`
    );
    setH2hResults(res.data);
  };

  return (
    <div className="h2h-container">
      <h2 className="h2h-header">Head-to-Head (H2H)</h2>
      <form onSubmit={handleSubmit} className="h2h-form">
        <input
          type="text"
          placeholder="Player 1"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="h2h-input"
        />
        <input
          type="text"
          placeholder="Player 2"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="h2h-input"
        />
        <button type="submit" className="h2h-button">Get H2H Results</button>
      </form>
      {h2hResults.length > 0 && (
        <table className="h2h-results-table">
          <thead>
            <tr>
              <th>Player 1</th>
              <th>Player 2</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {h2hResults.map((match) => (
              <tr key={match._id}>
                <td>{match.player1}</td>
                <td>{match.player2}</td>
                <td>{match.score1} - {match.score2}</td>
                <td>{new Date(match.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default H2H;
