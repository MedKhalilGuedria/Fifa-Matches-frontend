import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './PlayerMatches.css';

const PlayerMatches = () => {
  const { playerName } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`https://fifa-matches-results.onrender.com/api/matches/${playerName}`);
        console.log(response.data)
        setMatches(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch player matches.');
        setLoading(false);
      }
    };
    fetchMatches();
  }, [playerName]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Function to determine the match result for the player
  const getMatchResult = (match) => {
    if (match.score1 === match.score2) {
      return 'draw'; // It's a draw
    } else if (match.player1 === playerName) {
      return match.score1 > match.score2 ? 'win' : 'loss';
    } else if (match.player2 === playerName) {
      return match.score2 > match.score1 ? 'win' : 'loss';
    }
    return 'unknown'; // Default case
  };

  return (
    <div className="player-matches-container">
      <h1>{playerName}'s Matches</h1>
      <Link to="/" className="back-button">Back to Home</Link>
      <div className="matches-list">
        {matches.length === 0 ? (
          <p>No matches found for {playerName}.</p>
        ) : (
          matches.map((match) => {
            const result = getMatchResult(match);
            return (
              <div key={match._id} className="match-cardd">
                <div className="match-details">
                  <span className="player">{match.player1}</span>
                  <span className="vs">vs</span>
                  <span className="player">{match.player2}</span>
                </div>
                <div className="match-scores">
                  <span className="score">{match.score1}</span>
                  <span>-</span>
                  <span className="score">{match.score2}</span>
                  <div className={`result-square ${result}`}>
                    {result === 'win' && 'W'}
                    {result === 'loss' && 'L'}
                    {result === 'draw' && 'D'}
                  </div>
                </div>
                <div className="match-date">{new Date(match.date).toLocaleDateString()}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlayerMatches;