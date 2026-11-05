export class Match {
  constructor(opponent, players, duration = 25 * 60) {
    this.opponent = opponent;
    this.players = players;
    this.duration = duration;

    this.elapsedSeconds = 0;
    this.running = false;

    this.homeGoals = 0;
    this.awayGoals = 0;
    this.events = [];
  }

  get playersOnField() {
    return this.players.filter(player => player.onField);
  }

  addEvent(type, details = {}) {
    this.events.push({
      type,
      second: this.elapsedSeconds,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  scoreGoal(player) {
    player.goals++;
    this.homeGoals++;

    this.addEvent("goal", {
      player: player.name,
      number: player.number,
      score: `${this.homeGoals}-${this.awayGoals}`
    });
  }
}
