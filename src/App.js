import React, { useState, useEffect } from 'react';
import axios from 'axios';
import H2H from './H2H';
import './App.css';

const App = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [year, setYear] = useState('overall'); // Default to "Overall"
  const [form, setForm] = useState({
    player1: '',
    player2: '',
    score1: '',
    score2: '',
  });
  const [newPlayer, setNewPlayer] = useState('');

  const yearRange = Array.from({ length: 8 }, (_, i) => 2023 + i); // Generate years 2023-2030

  useEffect(() => {
    fetchMatchesAndPlayers();
  }, [year]);

  const fetchMatchesAndPlayers = async () => {
    try {
      const matchResponse = await axios.get(
        `https://fifa-matches-results.onrender.com/api/matches?year=${year}`
      );
      setMatches(matchResponse.data);

      const playerResponse = await axios.get(
        `https://fifa-matches-results.onrender.com/api/players?year=${year}`
      );
      setPlayers(playerResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePlayerChange = (e) => {
    setNewPlayer(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...form,
      score1: Number(form.score1),
      score2: Number(form.score2),
    };

    try {
      await axios.post('https://fifa-matches-results.onrender.com/api/matches', formData);
      setForm({
        player1: '',
        player2: '',
        score1: '',
        score2: '',
      });
      fetchMatchesAndPlayers();
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://fifa-matches-results.onrender.com/api/players', { name: newPlayer });
      setNewPlayer('');
      fetchMatchesAndPlayers();
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  return (
    <div className="container">
      <h1>FIFA Match Results</h1>

      {/* Year Filter */}
      <div className="year-filter">
        <label htmlFor="year-select">Filter by Year:</label>
        <select id="year-select" value={year} onChange={handleYearChange}>
          <option value="overall">Overall</option>
          {yearRange.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Add Match Form */}
      <h2>Add Match</h2>
      <form onSubmit={handleSubmit} className="form">
        <select
          name="player1"
          value={form.player1}
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Select Player 1</option>
          {players.map((player) => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <select
          name="player2"
          value={form.player2}
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Select Player 2</option>
          {players.map((player) => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="score1"
          placeholder="Player 1 Score"
          value={form.score1}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="number"
          name="score2"
          placeholder="Player 2 Score"
          value={form.score2}
          onChange={handleChange}
          required
          className="input"
        />
        <button type="submit" className="button">
          Add Match
        </button>
      </form>

      {/* Add Player Form */}
      <h2>Add New Player</h2>
      <form onSubmit={handlePlayerSubmit} className="form">
        <input
          type="text"
          placeholder="Player Name"
          value={newPlayer}
          onChange={handlePlayerChange}
          required
          className="input"
        />
        <button type="submit" className="button">
          Add Player
        </button>
      </form>

      {/* Match History */}
      <h2>Match History</h2>
      <ul className="list">
        {matches.map((match) => (
          <li key={match._id} className="list-item">
            {match.player1} vs {match.player2}: {match.score1} - {match.score2} on{' '}
            {new Date(match.date).toLocaleString()}
          </li>
        ))}
      </ul>

      {/* Player Rankings */}
      <h2>Player Rankings</h2>
      <div className="table-container">
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
</div>

      {/* Head-to-Head Component */}
      <H2H />
    </div>
  );
};

export default App;
