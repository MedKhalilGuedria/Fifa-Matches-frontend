import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompetitionManager = () => {
  const [competitions, setCompetitions] = useState([]);
  const [newCompetition, setNewCompetition] = useState({ name: '', season: '', players: [] });
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchCompetitions();
    fetchPlayers();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get('https://fifa-match-resultss-frontend.vercel.app/api/competitions');
      setCompetitions(response.data);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('https://fifa-match-resultss-frontend.vercel.app/api/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const createCompetition = async () => {
    try {
      const response = await axios.post('https://fifa-match-resultss-frontend.vercel.app/api/competitions', newCompetition);
      setCompetitions([...competitions, response.data]);
      setNewCompetition({ name: '', season: '', players: [] });
    } catch (error) {
      console.error('Error creating competition:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompetition({ ...newCompetition, [name]: value });
  };

  const handlePlayerSelection = (e) => {
    const { value } = e.target;
    setNewCompetition({
      ...newCompetition,
      players: Array.from(e.target.selectedOptions, (option) => option.value),
    });
  };

  const fetchCompetitionDetails = async (id) => {
    try {
      const response = await axios.get(`https://fifa-match-resultss-frontend.vercel.app/api/competitions/${id}`);
      const competition = response.data;
      alert(`Competition: ${competition.name}\nSeason: ${competition.season}\nRanking: ${competition.ranking.map((player, index) => `${index + 1}. ${player.name} - ${player.points} points`).join('\n')}`);
    } catch (error) {
      console.error('Error fetching competition details:', error);
    }
  };

  return (
    <div>
      <h1>Competition Manager</h1>

      <div>
        <h2>Create Competition</h2>
        <input
          type="text"
          name="name"
          placeholder="Competition Name"
          value={newCompetition.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="season"
          placeholder="Season"
          value={newCompetition.season}
          onChange={handleInputChange}
        />
        <select multiple value={newCompetition.players} onChange={handlePlayerSelection}>
          {players.map((player) => (
            <option key={player._id} value={player._id}>
              {player.name}
            </option>
          ))}
        </select>
        <button onClick={createCompetition}>Create</button>
      </div>

      <div>
        <h2>Competitions</h2>
        <ul>
          {competitions.map((competition) => (
            <li key={competition._id}>
              {competition.name} - {competition.season}
              <button onClick={() => fetchCompetitionDetails(competition._id)}>View Details</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompetitionManager;