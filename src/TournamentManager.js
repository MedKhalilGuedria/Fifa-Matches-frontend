import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TournamentManager.css'; // Add CSS for styling

const TournamentManager = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    name: '',
    participants: []
  });
  const [players, setPlayers] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchResult, setMatchResult] = useState({ score1: '', score2: '' });

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

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setMatchResult({ score1: '', score2: '' });
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      const winner = matchResult.score1 > matchResult.score2 ? selectedMatch.player1 : selectedMatch.player2;
      await axios.put(
        `https://fifa-matches-results.onrender.com/api/tournaments/${selectedMatch.tournamentId}/matches/${selectedMatch._id}`,
        { score1: matchResult.score1, score2: matchResult.score2, winner }
      );
      setSelectedMatch(null);
      fetchTournaments();
    } catch (error) {
      console.error('Error updating match result:', error);
    }
  };

  return (
    <div className="tournament-manager">
      <h1>Tournament Manager</h1>

      <div className="create-tournament">
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
      </div>

      <div className="tournament-list">
        <h2>Tournaments</h2>
        {tournaments.map((tournament) => (
          <div key={tournament._id} className="tournament">
            <h3>{tournament.name}</h3>
            <div className="bracket">
              {tournament.matches.map((match) => (
                <div
                  key={match._id}
                  className={`match ${match.status}`}
                  onClick={() => handleMatchClick({ ...match, tournamentId: tournament._id })}
                >
                  <div className="players">
                    <span>{match.player1}</span>
                    <span>vs</span>
                    <span>{match.player2 || 'BYE'}</span>
                  </div>
                  {match.status === 'completed' && (
                    <div className="result">
                      <span>{match.score1}</span>
                      <span>-</span>
                      <span>{match.score2}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedMatch && (
        <div className="modal">
          <div className="modal-content">
            <h3>Set Match Result</h3>
            <form onSubmit={handleResultSubmit}>
              <input
                type="number"
                placeholder={`${selectedMatch.player1} Score`}
                value={matchResult.score1}
                onChange={(e) => setMatchResult({ ...matchResult, score1: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder={`${selectedMatch.player2} Score`}
                value={matchResult.score2}
                onChange={(e) => setMatchResult({ ...matchResult, score2: e.target.value })}
                required
              />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setSelectedMatch(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentManager;