export class Player {
  constructor(number, name) {
    this.number = number;
    this.name = name;
    this.onField = false;
    this.secondsPlayed = 0;
    this.goals = 0;
    this.assists = 0;
  }

  get displayName() {
    return `${this.number} · ${this.name}`;
  }

  get formattedTime() {
    const minutes = Math.floor(this.secondsPlayed / 60);
    const seconds = Math.floor(this.secondsPlayed % 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}
