import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import H2H from './H2H';
import CompetitionManager from './CompetitionManager';
import './App.css';
import PlayerMatches from './PlayerMatches';
import Stats from './Stats';
import TournamentManager from './TournamentManager'; // New component
import PlayerTeam from './PlayerTeam';

const App = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [year, setYear] = useState('overall');
  const [form, setForm] = useState({
    player1: '',
    player2: '',
    score1: '',
    score2: '',
  });
  const [newPlayer, setNewPlayer] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const yearRange = Array.from({ length: 8 }, (_, i) => 2023 + i);

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

  const groupMatchesByDay = (matches) => {
    return matches.reduce((acc, match) => {
      const matchDate = new Date(match.date).toLocaleDateString();
      if (!acc[matchDate]) {
        acc[matchDate] = [];
      }
      acc[matchDate].push(match);
      return acc;
    }, {});
  };

  const paginatedDays = (groupedMatches, currentPage, daysPerPage) => {
    const days = Object.keys(groupedMatches);
    const totalPages = Math.ceil(days.length / daysPerPage);
    const startIndex = (currentPage - 1) * daysPerPage;
    const endIndex = startIndex + daysPerPage;
    const paginatedDays = days.slice(startIndex, endIndex);
    return { paginatedDays, totalPages };
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setCurrentPage(1);
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

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  sortedPlayers.forEach((player, index) => {
    player.rank = index + 1;
  });

  const groupedMatches = groupMatchesByDay(matches);
  const { paginatedDays: visibleDays, totalPages } = paginatedDays(groupedMatches, currentPage, 3);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Router>
      <div className="container">
        <nav className="menu">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/h2h">Head-to-Head</Link>
            </li>
            <li>
              <Link to="/competitions">Competitions</Link>
            </li>
            <li>
              <Link to="/stats">Stats</Link>
            </li>

            <li>
              <Link to="/tournaments">Tournaments</Link> 
            </li>

            <li>
              <Link to="/PT">Player/Team</Link> 
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div>
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
                {/* Match History */}


<h2 className="section-title">Match History</h2>
<div className="pagination-controls">
  <button
    className="pagination-button"
    onClick={handlePrevPage}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <button
    className="pagination-button"
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

<ul className="list">
  {visibleDays.map((day) => (
    <li key={day} className="list-day">
      <h3 className="day-title">{day}</h3>
      <ul className="matches-by-day">
        {groupedMatches[day].map((match) => (
          <li key={match._id} className="match-card">
            <div className="match-details">
              <div className="player-names">
                <span className="player">{match.player1}</span>
                <span className="vs">vs</span>
                <span className="player">{match.player2}</span>
              </div>
              <div className="match-scores">
                <span className="score">{match.score1}</span>
                <span>-</span>
                <span className="score">{match.score2}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>


                {/* Player Rankings */}
                <h2>Player Rankings</h2>
                <div className="rankings-table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Matches</th>
                        <th>Wins</th>
                        <th>Draws</th>
                        <th>Losses</th>
                        <th>Goals For</th>
                        <th>Goals Against</th>
                        <th>Goal Difference</th>
                        <th>Points</th>
                        <th>Efficiency</th>

                      </tr>
                    </thead>
                    <tbody>
  {sortedPlayers.map((player) => {
    const efficiency =
      player.matches > 0
        ? ((player.wins * 3 + player.draws) / (player.matches * 3)) * 100
        : 0;

    return (
      <tr key={player._id}>
        <td>{player.rank}</td>
        <Link to={`/player/${player.name}`} className="player-link">
    {player.name}
  </Link>        <td>{player.matches}</td>
        <td>{player.wins}</td>
        <td>{player.draws}</td>
        <td>{player.losses}</td>
        <td>{player.goalsFor}</td>
        <td>{player.goalsAgainst}</td>
        <td>{player.goalsFor - player.goalsAgainst}</td>
        <td>{player.points}</td>
        <td>{efficiency.toFixed(2)}%</td> {/* New Efficiency Column */}
      </tr>
    );
  })}
</tbody>
                  </table>
                </div>
              </div>
            }
          />
          <Route path="/h2h" element={<H2H />} />
          <Route path="/competitions" element={<CompetitionManager />} />
          <Route path="/player/:playerName" element={<PlayerMatches />} />
          <Route path="/stats" element={<Stats year={year} />} />
          <Route path="/tournaments" element={<TournamentManager />} /> {/* New route */}
          <Route path="/PT" element={<PlayerTeam />} /> {/* New route */}


        </Routes>
      </div>
    </Router>
  );
};

export default App;
