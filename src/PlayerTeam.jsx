import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerTeam.css'; // Create a CSS file for styling

const PlayerTeam = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]); // State for players
  const [newTeamName, setNewTeamName] = useState('');
  const [matchData, setMatchData] = useState({
    player1: '',
    player2: '',
    score1: 0,
    score2: 0
  });
  const [teamMatchData, setTeamMatchData] = useState({
    player1: '',
    player2: ''
  });

  // Fetch teams, matches, and players on component mount
  useEffect(() => {
    fetchTeams();
    fetchMatches();
    fetchPlayers();
  }, []);

  const fetchTeams = async () => {
    const response = await axios.get('https://fifa-matches-results.onrender.com/api/teams');
    setTeams(response.data);
  };

  const fetchMatches = async () => {
    const response = await axios.get('https://fifa-matches-results.onrender.com/api/matches');
    setMatches(response.data);
  };

  const fetchPlayers = async () => {
    const response = await axios.get('https://fifa-matches-results.onrender.com/api/players');
    setPlayers(response.data);
  };

  const addTeam = async () => {
    if (!newTeamName) {
      alert('Team name is required.');
      return;
    }
    await axios.post('https://fifa-matches-results.onrender.com/api/teams', { name: newTeamName });
    setNewTeamName('');
    fetchTeams();
  };

  const deleteTeam = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      await axios.delete(`https://fifa-matches-results.onrender.com/api/teams/${id}`);
      fetchTeams();
    }
  };

  const createMatch = async () => {
    if (!matchData.player1 || !matchData.player2) {
      alert('Both player1 and player2 are required.');
      return;
    }

    await axios.post('https://fifa-matches-results.onrender.com/api/matches', matchData);
    setMatchData({
      player1: '',
      player2: '',
      score1: 0,
      score2: 0
    });
    fetchMatches();
  };

  const generateTeamMatch = async () => {
    if (!teamMatchData.player1 || !teamMatchData.player2) {
      alert('Both player1 and player2 are required.');
      return;
    }

    await axios.post('https://fifa-matches-results.onrender.com/api/generate-team-match', teamMatchData);
    setTeamMatchData({
      player1: '',
      player2: ''
    });
    fetchMatches();
  };

  return (
    <div className="player-team-container">
      <h1>Teams</h1>
      <ul className="teams-list">
        {teams.map(team => (
          <li key={team._id} className="team-item">
            {team.name}
            <button className="delete-button" onClick={() => deleteTeam(team._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="add-team-form">
        <input
          type="text"
          placeholder="Team Name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="input-field"
        />
        <button onClick={addTeam} className="action-button">Add Team</button>
      </div>

      <h1>Create Player Match</h1>
      <div className="match-form">
        <select
          value={matchData.player1}
          onChange={(e) => setMatchData({ ...matchData, player1: e.target.value })}
          className="input-field"
        >
          <option value="">Select Player 1</option>
          {players.map(player => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <select
          value={matchData.player2}
          onChange={(e) => setMatchData({ ...matchData, player2: e.target.value })}
          className="input-field"
        >
          <option value="">Select Player 2</option>
          {players.map(player => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Score 1"
          value={matchData.score1}
          onChange={(e) => setMatchData({ ...matchData, score1: e.target.value })}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Score 2"
          value={matchData.score2}
          onChange={(e) => setMatchData({ ...matchData, score2: e.target.value })}
          className="input-field"
        />
        <button onClick={createMatch} className="action-button">Create Match</button>
      </div>

      <h1>Generate Team Match</h1>
      <div className="team-match-form">
        <select
          value={teamMatchData.player1}
          onChange={(e) => setTeamMatchData({ ...teamMatchData, player1: e.target.value })}
          className="input-field"
        >
          <option value="">Select Player 1</option>
          {players.map(player => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <select
          value={teamMatchData.player2}
          onChange={(e) => setTeamMatchData({ ...teamMatchData, player2: e.target.value })}
          className="input-field"
        >
          <option value="">Select Player 2</option>
          {players.map(player => (
            <option key={player._id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <button onClick={generateTeamMatch} className="action-button">Generate Team Match</button>
      </div>

      <h1>Matches</h1>
      <ul className="matches-list">
        {matches.map(match => (
          <li key={match._id} className="match-item">
            {match.team1 ? (
              <>
                <strong>{match.player1}</strong> (Team: {match.team1}) vs <strong>{match.player2}</strong> (Team: {match.team2})
                <br />
                Score: {match.score1} - {match.score2}
                <br />
                Winner: {match.winner || 'Pending'}
              </>
            ) : (
              <>
                <strong>{match.player1}</strong> vs <strong>{match.player2}</strong>
                <br />
                Score: {match.score1} - {match.score2}
                <br />
                Winner: {match.winner || 'Pending'}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerTeam;