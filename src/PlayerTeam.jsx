import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayerTeam = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [matchData, setMatchData] = useState({
    player1: '',
    player2: '',
    score1: 0,
    score2: 0
  });
  const [teamMatchData, setTeamMatchData] = useState({
    team1: '',
    team2: ''
  });

  // Fetch teams and matches on component mount
  useEffect(() => {
    fetchTeams();
    fetchMatches();
  }, []);

  const fetchTeams = async () => {
    const response = await axios.get('https://fifa-matches-results.onrender.com/api/teams');
    setTeams(response.data);
  };

  const fetchMatches = async () => {
    const response = await axios.get('https://fifa-matches-results.onrender.com/api/matches');
    setMatches(response.data);
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
    if (!teamMatchData.team1 || !teamMatchData.team2) {
      alert('Both team1 and team2 are required.');
      return;
    }

    await axios.post('https://fifa-matches-results.onrender.com/api/generate-team-match', teamMatchData);
    setTeamMatchData({
      team1: '',
      team2: ''
    });
    fetchMatches();
  };

  return (
    <div>
      <h1>Teams</h1>
      <ul>
        {teams.map(team => (
          <li key={team._id}>{team.name}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Team Name"
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)}
      />
      <button onClick={addTeam}>Add Team</button>

      <h1>Create Player Match</h1>
      <input
        type="text"
        placeholder="Player 1"
        value={matchData.player1}
        onChange={(e) => setMatchData({ ...matchData, player1: e.target.value })}
      />
      <input
        type="text"
        placeholder="Player 2"
        value={matchData.player2}
        onChange={(e) => setMatchData({ ...matchData, player2: e.target.value })}
      />
      <input
        type="number"
        placeholder="Score 1"
        value={matchData.score1}
        onChange={(e) => setMatchData({ ...matchData, score1: e.target.value })}
      />
      <input
        type="number"
        placeholder="Score 2"
        value={matchData.score2}
        onChange={(e) => setMatchData({ ...matchData, score2: e.target.value })}
      />
      <button onClick={createMatch}>Create Match</button>

      <h1>Generate Team Match</h1>
      <select
        value={teamMatchData.team1}
        onChange={(e) => setTeamMatchData({ ...teamMatchData, team1: e.target.value })}
      >
        <option value="">Select Team 1</option>
        {teams.map(team => (
          <option key={team._id} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>
      <select
        value={teamMatchData.team2}
        onChange={(e) => setTeamMatchData({ ...teamMatchData, team2: e.target.value })}
      >
        <option value="">Select Team 2</option>
        {teams.map(team => (
          <option key={team._id} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>
      <button onClick={generateTeamMatch}>Generate Team Match</button>

      <h1>Matches</h1>
      <ul>
        {matches.map(match => (
          <li key={match._id}>
            {match.team1 ? (
              <>
                <strong>{match.team1}</strong> vs <strong>{match.team2}</strong>
                <br />
                Players: {match.team1Players?.join(', ')} vs {match.team2Players?.join(', ')}
              </>
            ) : (
              <>
                <strong>{match.player1}</strong> vs <strong>{match.player2}</strong>
              </>
            )}
            <br />
            Score: {match.score1} - {match.score2}
            <br />
            Winner: {match.winner || 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerTeam;