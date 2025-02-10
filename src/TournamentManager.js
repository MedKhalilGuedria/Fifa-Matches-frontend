import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TournamentManager.css';

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

  const handleMatchClick = (match, tournamentId) => {
    if (match.player1 && match.player2 && match.status !== 'completed') {
      setSelectedMatch({ ...match, tournamentId });
      setMatchResult({ score1: '', score2: '' });
    }
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      const winner = parseInt(matchResult.score1) > parseInt(matchResult.score2) 
        ? selectedMatch.player1 
        : selectedMatch.player2;
      
      await axios.put(
        `https://fifa-matches-results.onrender.com/api/tournaments/${selectedMatch.tournamentId}/matches/${selectedMatch._id}`,
        { 
          score1: parseInt(matchResult.score1), 
          score2: parseInt(matchResult.score2), 
          winner 
        }
      );
      setSelectedMatch(null);
      fetchTournaments();
    } catch (error) {
      console.error('Error updating match result:', error);
    }
  };

  const getRoundName = (round, totalRounds) => {
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semi-Finals';
    if (round === totalRounds - 2) return 'Quarter-Finals';
    if (round === totalRounds - 3) return 'Round of 16';
    if (round === totalRounds - 4) return 'Round of 32';
    return `Round ${round}`;
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

      <div className="tournaments-list">
        {tournaments.map((tournament) => (
          <div key={tournament._id} className="tournament">
            <h2>{tournament.name}</h2>
            <div className="bracket">
              {Array.from(new Set(tournament.matches.map(m => m.round)))
                .sort((a, b) => a - b)
                .map((round, index, allRounds) => (
                  <div key={round} className="round">
                    <h3>{getRoundName(round, allRounds.length)}</h3>
                    <div className="matches">
                      {tournament.matches
                        .filter(match => match.round === round)
                        .map((match, i) => (
                          <div
                            key={match._id}
                            className={`match ${match.status} ${(!match.player1 || !match.player2) ? 'pending' : ''}`}
                            onClick={() => handleMatchClick(match, tournament._id)}
                          >
                            <div className={`player ${match.winner === match.player1 ? 'winner' : ''}`}>
                              {match.player1 || 'TBD'}
                              {match.status === 'completed' && <span className="score">{match.score1}</span>}
                            </div>
                            <div className={`player ${match.winner === match.player2 ? 'winner' : ''}`}>
                              {match.player2 || 'TBD'}
                              {match.status === 'completed' && <span className="score">{match.score2}</span>}
                            </div>
                            {/* Connection lines */}
                            {index < allRounds.length - 1 && <div className="connector"></div>}
                          </div>
                        ))}
                    </div>
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
              <div className="input-group">
                <label>
                  {selectedMatch.player1} Score:
                  <input
                    type="number"
                    min="0"
                    value={matchResult.score1}
                    onChange={(e) => setMatchResult({ ...matchResult, score1: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div className="input-group">
                <label>
                  {selectedMatch.player2} Score:
                  <input
                    type="number"
                    min="0"
                    value={matchResult.score2}
                    onChange={(e) => setMatchResult({ ...matchResult, score2: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div className="button-group">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setSelectedMatch(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentManager;