export class MatchTimer {
  constructor(match, onTick, onEnd = () => {}) {
    this.match = match;
    this.onTick = onTick;
    this.onEnd = onEnd;
    this.interval = null;
    this.lastTimestamp = null;
  }

  start() {
    if (this.match.running) return;

    this.match.running = true;
    this.lastTimestamp = Date.now();

    this.interval = setInterval(() => {
      this.tick();
    }, 250);

    this.onTick();
  }

  tick() {
    if (!this.match.running) return;

    const now = Date.now();

    const delta = Math.max(
      0,
      (now - this.lastTimestamp) / 1000
    );

    this.lastTimestamp = now;

    const remaining = Math.max(
      0,
      this.match.duration - this.match.elapsedSeconds
    );

    const increment = Math.min(delta, remaining);

    this.match.elapsedSeconds += increment;

    for (const player of this.match.playersOnField) {
      player.secondsPlayed += increment;
    }

    if (this.match.elapsedSeconds >= this.match.duration) {
      this.match.running = false;
      clearInterval(this.interval);
      this.interval = null;

      this.onTick();
      this.onEnd();
      return;
    }

    this.onTick();
  }

  stop() {
    if (!this.match.running) return;

    this.tick();

    if (!this.match.running) return;

    this.match.running = false;
    clearInterval(this.interval);
    this.interval = null;

    this.onTick();
  }
}
