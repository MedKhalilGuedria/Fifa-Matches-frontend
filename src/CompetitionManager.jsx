import React, { useState, useEffect } from "react";
import axios from "axios";

const CompetitionManager = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [matchDetails, setMatchDetails] = useState({
    player1Id: "",
    player2Id: "",
    score1: 0,
    score2: 0,
  });

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get("https://fifa-matches-results.onrender.com/api/competitions");
      setCompetitions(response.data);
    } catch (error) {
      console.error("Error fetching competitions", error);
    }
  };

  const handleCompetitionSelect = (competition) => {
    setSelectedCompetition(competition);
    setPlayers(competition.players);
    setMatches(competition.matches);
  };

  const addPlayer = async () => {
    if (!newPlayer) return;

    try {
      const response = await axios.post(
        `https://fifa-matches-results.onrender.com/api/competitions/${selectedCompetition._id}/players`,
        { name: newPlayer }
      );
      setPlayers([...players, response.data]);
      setNewPlayer("");
    } catch (error) {
      console.error("Error adding player", error);
    }
  };

  const addMatch = async () => {
    const { player1Id, player2Id, score1, score2 } = matchDetails;
    if (!player1Id || !player2Id || player1Id === player2Id) {
      alert("Select valid players for the match.");
      return;
    }

    try {
      const response = await axios.post(
        `https://fifa-matches-results.onrender.com/api/competitions/${selectedCompetition._id}/matches`,
        { player1Id, player2Id, score1, score2 }
      );
      fetchCompetitions(); // Refresh data to update rankings
      setMatchDetails({ player1Id: "", player2Id: "", score1: 0, score2: 0 });
    } catch (error) {
      console.error("Error adding match", error);
    }
  };

  return (
    <div>
      <h1>Competition Manager</h1>

      {/* Competition List */}
      <div>
        <h2>Competitions</h2>
        {competitions.map((comp) => (
          <button
            key={comp._id}
            onClick={() => handleCompetitionSelect(comp)}
            style={{
              margin: "5px",
              backgroundColor: selectedCompetition?._id === comp._id ? "lightblue" : "white",
            }}
          >
            {comp.name}
          </button>
        ))}
      </div>

      {selectedCompetition && (
        <>
          {/* Rankings */}
          <div>
            <h2>Rankings for {selectedCompetition.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
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
                {players
                  .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor)
                  .map((player, index) => (
                    <tr key={player._id}>
                      <td>{index + 1}</td>
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

          {/* Add Player */}
          <div>
            <h2>Add Player</h2>
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              placeholder="Player Name"
            />
            <button onClick={addPlayer}>Add</button>
          </div>

          {/* Add Match */}
          <div>
            <h2>Add Match</h2>
            <select
              value={matchDetails.player1Id}
              onChange={(e) => setMatchDetails({ ...matchDetails, player1Id: e.target.value })}
            >
              <option value="">Select Player 1</option>
              {players.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name}
                </option>
              ))}
            </select>
            <select
              value={matchDetails.player2Id}
              onChange={(e) => setMatchDetails({ ...matchDetails, player2Id: e.target.value })}
            >
              <option value="">Select Player 2</option>
              {players.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={matchDetails.score1}
              onChange={(e) => setMatchDetails({ ...matchDetails, score1: +e.target.value })}
              placeholder="Player 1 Score"
            />
            <input
              type="number"
              value={matchDetails.score2}
              onChange={(e) => setMatchDetails({ ...matchDetails, score2: +e.target.value })}
              placeholder="Player 2 Score"
            />
            <button onClick={addMatch}>Add Match</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompetitionManager;
