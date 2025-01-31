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

  return (
    <div className="player-matches-container">
      <h1>{playerName}'s Matches</h1>
      <Link to="/" className="back-button">Back to Home</Link>
      <div className="matches-list">
        {matches.length === 0 ? (
          <p>No matches found for {playerName}.</p>
        ) : (
          matches.map((match) => (
            <div key={match._id} className="match-card">
              <div className="match-details">
                <span className="player">{match.player1}</span>
                <span className="vs">vs</span>
                <span className="player">{match.player2}</span>
              </div>
              <div className="match-scores">
                <span className="score">{match.score1}</span>
                <span>-</span>
                <span className="score">{match.score2}</span>
              </div>
              <div className="match-date">{new Date(match.date).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerMatches;
