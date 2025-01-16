import React, { useState, useEffect } from 'react';
import axios from 'axios';
import H2H from './H2H';
import './App.css';


const App = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [year, setYear] = useState('overall'); // Default to "Overall"

  useEffect(() => {
    fetchMatchesAndPlayers();
  }, [year]); // Refetch data when the year changes

  const fetchMatchesAndPlayers = async () => {
    try {
      // Fetch matches filtered by year
      const matchResponse = await axios.get(`https://fifa-matches-results.onrender.com/api/matches?year=${year}`);
      setMatches(matchResponse.data);

      // Fetch rankings dynamically based on the selected year
      const playerResponse = await axios.get(`https://fifa-matches-results.onrender.com/api/players?year=${year}`);
      setPlayers(playerResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <div className="container">
      <h1>FIFA Match Results</h1>

      {/* Year Filter */}
      <div className="year-filter">
        <label htmlFor="year-select">Filter by Year:</label>
        <select id="year-select" value={year} onChange={handleYearChange}>
          <option value="overall">Overall</option>
          {/* Dynamically populate years from matches */}
          {[...new Set(matches.map((match) => new Date(match.date).getFullYear()))].map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Rankings */}
      <h2>Player Rankings</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Matches</th>
            <th>Wins</th>
            <th>Draws</th>
            <th>Losses</th>
            <th>Goals For</th>
            <th>Goals Against</th>
            <th>Goal Difference</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player._id}>
              <td>{player.name}</td>
              <td>{player.matches}</td>
              <td>{player.wins}</td>
              <td>{player.draws}</td>
              <td>{player.losses}</td>
              <td>{player.goalsFor}</td>
              <td>{player.goalsAgainst}</td>
              <td>{player.goalsFor - player.goalsAgainst}</td>
              <td>{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <H2H/>
    </div>
  );
};

export default App;
