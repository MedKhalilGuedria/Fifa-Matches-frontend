const App = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [year, setYear] = useState('overall'); // Default year selection
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
  }, [year]); // Refetch data when the year changes

  const fetchMatches = async () => {
    const res = await axios.get(`https://fifa-matches-results.onrender.com/api/matches?year=${year}`);
    setMatches(res.data);
  };

  const fetchPlayers = async () => {
    const res = await axios.get(`https://fifa-matches-results.onrender.com/api/players?year=${year}`);
    const sortedPlayers = res.data.sort((a, b) => {
      if (b.points === a.points) {
        return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
      }
      return b.points - a.points;
    });
    setPlayers(sortedPlayers);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value); // Update the selected year
  };

  return (
    <div className="container">
      <h1>FIFA Match Results</h1>

      {/* Year Filter */}
      <div className="year-filter">
        <label htmlFor="year-select">Filter by Year: </label>
        <select id="year-select" value={year} onChange={handleYearChange} className="input">
          <option value="overall">Overall</option>
          {/* Dynamically generate years */}
          {[...new Set(matches.map(match => new Date(match.date).getFullYear()))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Other UI Elements */}
      {/* Player Rankings, Matches, and Forms */}
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
    </div>
  );
};
