import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Stats.css';

// Modal Component (inside the Stats component)
const Modal = ({ isOpen, closeModal, title, details }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{details}</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

const Stats = ({ year }) => {
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState({ title: '', details: '' });

  useEffect(() => {
    fetchMatches();
  }, [year]);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`https://fifa-matches-results.onrender.com/api/matches?year=${year}`);
      setMatches(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const calculateStats = (matches) => {
    if (matches.length === 0) return;
  
    let totalMatches = matches.length;
    let totalGoals = 0;
    let draws = 0;
    let oneSideScored = 0;
    let highScoringMatches = 0;
    let highestScoringMatch = null;
    let lowestScoringMatch = null;
    let resultCount = {};
    let playerStats = {};
  
    matches.forEach(({ player1, player2, score1, score2 }) => {
      totalGoals += score1 + score2;
  
      // Track most repeated results
      const result = `${score1}-${score2}`;
      resultCount[result] = (resultCount[result] || 0) + 1;
  
      if (score1 === score2) draws++;
      if (score1 === 0 || score2 === 0) oneSideScored++;
      if (score1 >= 10 || score2 >= 10) highScoringMatches++;
  
      const matchTotalGoals = score1 + score2;
      if (!highestScoringMatch || matchTotalGoals > highestScoringMatch.total) {
        highestScoringMatch = { player1, player2, score1, score2, total: matchTotalGoals };
      }
      if (!lowestScoringMatch || matchTotalGoals < lowestScoringMatch.total) {
        lowestScoringMatch = { player1, player2, score1, score2, total: matchTotalGoals };
      }
  
      // Player stats
      [
        { name: player1, scored: score1, conceded: score2, won: score1 > score2, drew: score1 === score2 },
        { name: player2, scored: score2, conceded: score1, won: score2 > score1, drew: score1 === score2 }
      ].forEach(({ name, scored, conceded, won, drew }) => {
        // Initialize player stats if undefined, using default values
        if (!playerStats[name]) {
          playerStats[name] = { matches: 0, wins: 0, draws: 0, goalsFor: 0, goalsAgainst: 0 };
        }
  
        // Safely update the player's stats using optional chaining and defaults
        playerStats[name].matches = (playerStats[name]?.matches || 0) + 1;
        playerStats[name].goalsFor = (playerStats[name]?.goalsFor || 0) + scored;
        playerStats[name].goalsAgainst = (playerStats[name]?.goalsAgainst || 0) + conceded;
        playerStats[name].wins = (playerStats[name]?.wins || 0) + (won ? 1 : 0);
        playerStats[name].draws = (playerStats[name]?.draws || 0) + (drew ? 1 : 0);
      });
    });
  
    const mostRepeatedResult = Object.keys(resultCount).reduce((a, b) => (resultCount[a] > resultCount[b] ? a : b), '');
    const bestAttack = Object.keys(playerStats).reduce((a, b) => (playerStats[a]?.goalsFor > playerStats[b]?.goalsFor ? a : b), '');
    const bestDefense = Object.keys(playerStats).reduce((a, b) => (playerStats[a]?.goalsAgainst < playerStats[b]?.goalsAgainst ? a : b), '');
    const worstAttack = Object.keys(playerStats).reduce((a, b) => (playerStats[a]?.goalsFor < playerStats[b]?.goalsFor ? a : b), '');
    const worstDefense = Object.keys(playerStats).reduce((a, b) => (playerStats[a]?.goalsAgainst > playerStats[b]?.goalsAgainst ? a : b), '');
    const mostWins = Object.keys(playerStats).reduce((a, b) => (playerStats[a]?.wins > playerStats[b]?.wins ? a : b), '');
    const mostDraws = Object.keys(playerStats).reduce((a, b) => (playerStats[a]?.draws > playerStats[b]?.draws ? a : b), '');
    const mostEfficientPlayer = Object.keys(playerStats).reduce((a, b) => ((playerStats[a]?.wins / playerStats[a]?.matches) > (playerStats[b]?.wins / playerStats[b]?.matches) ? a : b), '');
  
    setStats({
      totalMatches,
      totalGoals,
      draws,
      oneSideScored,
      highScoringMatches,
      mostRepeatedResult,
      highestScoringMatch,
      lowestScoringMatch,
      bestAttack,
      bestDefense,
      worstAttack,
      worstDefense,
      mostWins,
      mostDraws,
      mostEfficientPlayer,
    });
  };
  
  

  const handleCardClick = (title, details) => {
    setModalDetails({ title, details });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="stats-container">
      <h2 className="stats-title">Match & Player Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card" onClick={() => handleCardClick('Most Repeated Result', `Result: ${stats.mostRepeatedResult}, Occurrences: ${Object.values(stats.mostRepeatedResult).length}, Matches: ${JSON.stringify(matches.filter(match => `${match.score1}-${match.score2}` === stats.mostRepeatedResult))}`)}>
          <div className="stat-title">Most Repeated Result</div>
          <div className="stat-value">{stats.mostRepeatedResult}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Total Matches', `Total Matches Played: ${stats.totalMatches}`)}>
          <div className="stat-title">Total Matches</div>
          <div className="stat-value">{stats.totalMatches}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Total Goals', `Total Goals Scored: ${stats.totalGoals}`)}>
          <div className="stat-title">Total Goals</div>
          <div className="stat-value">{stats.totalGoals}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Total Draws', `Total Draws: ${stats.draws}`)}>
          <div className="stat-title">Total Draws</div>
          <div className="stat-value">{stats.draws}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Matches with One Side Scoring', `Matches where one side didn't score: ${stats.oneSideScored}`)}>
          <div className="stat-title">Matches with One Side Scoring</div>
          <div className="stat-value">{stats.oneSideScored}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('High Scoring Matches (10+ goals)', `Matches with more than 10 goals: ${stats.highScoringMatches}`)}>
          <div className="stat-title">High Scoring Matches (10+ goals)</div>
          <div className="stat-value">{stats.highScoringMatches}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Highest Scoring Match', `Highest Scoring Match: ${stats.highestScoringMatch.player1} vs ${stats.highestScoringMatch.player2}, Score: ${stats.highestScoringMatch.score1}-${stats.highestScoringMatch.score2}`)}>
          <div className="stat-title">Highest Scoring Match</div>
          <div className="stat-value">{stats.highestScoringMatch?.player1} {stats.highestScoringMatch?.score1}-{stats.highestScoringMatch?.score2} {stats.highestScoringMatch?.player2}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Lowest Scoring Match', `Lowest Scoring Match: ${stats.lowestScoringMatch.player1} vs ${stats.lowestScoringMatch.player2}, Score: ${stats.lowestScoringMatch.score1}-${stats.lowestScoringMatch.score2}`)}>
          <div className="stat-title">Lowest Scoring Match</div>
          <div className="stat-value">{stats.lowestScoringMatch?.player1} {stats.lowestScoringMatch?.score1}-{stats.lowestScoringMatch?.score2} {stats.lowestScoringMatch?.player2}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Best Attack', `Player with the Best Attack: ${stats.bestAttack}`)}>
          <div className="stat-title">Best Attack</div>
          <div className="stat-value">{stats.bestAttack}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Best Defense', `Player with the Best Defense: ${stats.bestDefense}`)}>
          <div className="stat-title">Best Defense</div>
          <div className="stat-value">{stats.bestDefense}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Worst Attack', `Player with the Worst Attack: ${stats.worstAttack}`)}>
          <div className="stat-title">Worst Attack</div>
          <div className="stat-value">{stats.worstAttack}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Worst Defense', `Player with the Worst Defense: ${stats.worstDefense}`)}>
          <div className="stat-title">Worst Defense</div>
          <div className="stat-value">{stats.worstDefense}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Most Wins', `Player with the Most Wins: ${stats.mostWins}`)}>
          <div className="stat-title">Most Wins</div>
          <div className="stat-value">{stats.mostWins}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Most Draws', `Player with the Most Draws: ${stats.mostDraws}`)}>
          <div className="stat-title">Most Draws</div>
          <div className="stat-value">{stats.mostDraws}</div>
        </div>
        <div className="stat-card" onClick={() => handleCardClick('Most Efficient Player', `Most Efficient Player: ${stats.mostEfficientPlayer}`)}>
          <div className="stat-title">Most Efficient Player</div>
          <div className="stat-value">{stats.mostEfficientPlayer}</div>
        </div>
      </div>

      {/* Modal for showing detailed information */}
      <Modal isOpen={modalOpen} closeModal={closeModal} title={modalDetails.title} details={modalDetails.details} />
    </div>
  );
};

export default Stats;
