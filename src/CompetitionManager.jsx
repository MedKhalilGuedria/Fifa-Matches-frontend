import React, { useState, useEffect } from "react";
import axios from "axios";
import './comp.css'

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
  const [newCompetition, setNewCompetition] = useState("");

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get("https://fifa-matches-results.onrender.com/api/competitions");
      setCompetitions(response.data);
      if (response.data.length > 0) {
        setSelectedCompetition(response.data[0]);
        setPlayers(response.data[0].players);
        setMatches(response.data[0].matches);
      }
    } catch (error) {
      console.error("Error fetching competitions", error);
    }
  };

  const handleCompetitionSelect = (competition) => {
    setSelectedCompetition(competition);
    setPlayers(competition.players);
    setMatches(competition.matches);
  };

  const createCompetition = async () => {
    if (!newCompetition.trim()) {
      alert("Competition name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("https://fifa-matches-results.onrender.com/api/competitions", { name: newCompetition });
      setCompetitions([...competitions, response.data]);
      setNewCompetition("");

      setSelectedCompetition(response.data);
      setPlayers(response.data.players || []);
      setMatches(response.data.matches || []);
    } catch (error) {
      console.error("Error creating competition", error);
    }
  };
  const fetchMatches = async (competitionId) => {
    try {
      const response = await axios.get(
        `https://fifa-matches-results.onrender.com/api/competitions/${competitionId}/matches`
      );
      setMatches(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching matches", error);
    }
  };

  const drawMatches = async () => {
    if (!selectedCompetition) {
      alert("Please select a competition first.");
      return;
    }

    try {
      await axios.post(
        `https://fifa-matches-results.onrender.com/api/competitions/${selectedCompetition._id}/draw`
      );
      fetchMatches(selectedCompetition._id); // Refresh matches
      alert("Random draw completed! Matches have been generated.");
    } catch (error) {
      console.error("Error generating draw", error);
      alert("Failed to generate matches.");
    }
  };

  const addPlayer = async () => {
    if (!newPlayer.trim()) return;

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
      fetchCompetitions();
      setMatchDetails({ player1Id: "", player2Id: "", score1: 0, score2: 0 });
    } catch (error) {
      console.error("Error adding match", error);
    }
  };

  return (
    <div>
      <h1>Competition Manager</h1>

      {/* Create Competition */}
      <div className="create-competition">
        <h2>Create Competition</h2>
        <input
          type="text"
          value={newCompetition}
          onChange={(e) => setNewCompetition(e.target.value)}
          placeholder="Competition Name"
        />
        <button onClick={createCompetition}>Create Competition</button>
      </div>

      {/* Competition List */}
      <div className="competitions-list">
        <h2>Competitions</h2>
        {competitions.length === 0 ? (
          <p>No competitions available. Create one to get started!</p>
        ) : (
          <div className="competitions-cards">
            {competitions.map((comp) => (
              <div
                key={comp._id}
                className={`competition-card ${selectedCompetition?._id === comp._id ? "active" : ""}`}
                onClick={() => handleCompetitionSelect(comp)}
              >
                <h3>{comp.name}</h3>
                <p>{comp.players.length} Players</p>
                <p>{comp.matches.length} Matches</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCompetition ? (
        <>
        <button onClick={drawMatches}>Generate Random Matches for Next Round</button>
          {/* Rankings */}
          <div className="rankings-table-container">
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
          <div className="add-match-container">
            <h2>Add Player</h2>
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              placeholder="Player Name"
            />
            <button onClick={addPlayer}>Add</button>
          </div>

          <div className="add-match-container">
    <h2>Add Match</h2>
    <div>
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
        <h2>Matches for {selectedCompetition.name}</h2>
          {matches.length === 0 ? (
            <p>No matches available. Generate matches to start!</p>
          ) : (
            <table className="matches-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, index) => (
                  <tr key={match._id}>
                    <td>{index + 1}</td>
                    <td>{match.player1?.name || "Unknown"}</td>
                    <td>{match.player2?.name || "Unknown"}</td>
                    <td>
                      {match.score1} - {match.score2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
    </div>
</div>

        </>
      ) : (
        <p>Please create or select a competition to manage players and matches.</p>
      )}
    </div>
  );
};

export default CompetitionManager;
