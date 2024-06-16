import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({
    player1: '',
    player2: '',
    score1: '',
    score2: ''
  });
  const [newPlayer, setNewPlayer] = useState('');

  useEffect(() => {
    fetchMatches();
    fetchPlayers();
  }, []);

  const fetchMatches = async () => {
    const res = await axios.get('http://fifa-matches.vercel.app/api/matches');
    setMatches(res.data);
  };

  const fetchPlayers = async () => {
    const res = await axios.get('http://fifa-matches.vercel.app/api/players');
    setPlayers(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handlePlayerChange = (e) => {
    setNewPlayer(e.target.value);
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    await axios.post('https://fifa-matches.vercel.app/api/players', { name: newPlayer });
    setNewPlayer('');
    fetchPlayers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure scores are numbers
    const formData = {
      ...form,
      score1: Number(form.score1),
      score2: Number(form.score2)
    };
    await axios.post('https://fifa-matches.vercel.app/api/matches', formData);
    setForm({
      player1: '',
      player2: '',
      score1: '',
      score2: ''
    });
    fetchMatches();
    fetchPlayers();
  };

  return (
    <div className="container">
      <h1>FIFA Match Results</h1>
      <form onSubmit={handleSubmit} className="form">
        <select name="player1" value={form.player1} onChange={handleChange} required className="input">
          <option value="">Select Player 1</option>
          {players.map((player) => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <select name="player2" value={form.player2} onChange={handleChange} required className="input">
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
        <button type="submit" className="button">Add Match</button>
      </form>
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
        <button type="submit" className="button">Add Player</button>
      </form>
      <h2>Match History</h2>
      <ul className="list">
        {matches.map((match) => (
          <li key={match._id} className="list-item">
            {match.player1} vs {match.player2}: {match.score1} - {match.score2} on {new Date(match.date).toLocaleString()}
          </li>
        ))}
      </ul>
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
    </div>
  );
};

export default App;
