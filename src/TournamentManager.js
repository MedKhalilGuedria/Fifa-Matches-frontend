import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TournamentManager = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    name: '',
    participants: []
  });
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchTournaments();
    fetchPlayers();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get('https://fifa-matches-results.onrender.com/api/tournaments');
      setTournaments(response.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('https://fifa-matches-results.onrender.com/api/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTournament({ ...newTournament, [name]: value });
  };

  const handleParticipantChange = (e) => {
    const options = e.target.options;
    const selectedParticipants = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedParticipants.push(options[i].value);
      }
    }
    setNewTournament({ ...newTournament, participants: selectedParticipants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://fifa-matches-results.onrender.com/api/tournaments', newTournament);
      setNewTournament({ name: '', participants: [] });
      fetchTournaments();
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  return (
    <div>
      <h1>Tournament Manager</h1>

      <h2>Create New Tournament</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Tournament Name"
          value={newTournament.name}
          onChange={handleInputChange}
          required
        />
        <select
          name="participants"
          multiple
          value={newTournament.participants}
          onChange={handleParticipantChange}
          required
        >
          {players.map((player) => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <button type="submit">Create Tournament</button>
      </form>

      <h2>Tournaments</h2>
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament._id}>
            <h3>{tournament.name}</h3>
            <ul>
              {tournament.matches.map((match) => (
                <li key={match._id}>
                  {match.player1} vs {match.player2} - Winner: {match.winner || 'TBD'}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentManager;