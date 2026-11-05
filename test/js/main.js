import { Player } from "./models/Player.js";
import { Match } from "./models/Match.js";
import { MatchTimer } from "./services/MatchTimer.js";

const SQUAD = [
  [1, "Mauro"],
  [3, "Javi"],
  [4, "Elías"],
  [5, "Brais"],
  [6, "Xabi"],
  [7, "Roque"],
  [8, "Leo Estévez"],
  [9, "Thiago"],
  [10, "Enzo"],
  [11, "Angelo"],
  [12, "Xes"],
  [14, "Leo Mendez"]
];

class Application {
  constructor() {
    this.players = SQUAD.map(
      ([number, name]) => new Player(number, name)
    );

    this.match = new Match(
      "Rival de prueba",
      this.players,
      25 * 60
    );

    this.starters = new Set();
    this.started = false;
    this.finished = false;

    this.timer = new MatchTimer(
      this.match,
      () => this.render(),
      () => this.onTimeUp()
    );
  }

  start() {
    this.bindEvents();

    document.getElementById("estado").textContent =
      "✅ TEST · Sin conexión a Firebase";

    this.render();
  }

  bindEvents() {
    document.getElementById("iniciar")
      .addEventListener("click", () => {
        this.startMatch();
      });

    document.getElementById("finalizar")
      .addEventListener("click", () => {
        this.finishMatch();
      });

    document.getElementById("golRival")
      .addEventListener("click", () => {
        this.addRivalGoal();
      });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.timer.tick();
        this.render();
      }
    });
  }

  getPlayer(number) {
    return this.players.find(
      player => player.number === number
    );
  }

  selectStarter(number) {
    if (this.started) return;

    if (this.starters.has(number)) {
      this.starters.delete(number);
    } else {
      if (this.starters.size >= 8) {
        alert("Solo puedes seleccionar 8 titulares.");
        return;
      }

      this.starters.add(number);
    }

    this.render();
  }

  startMatch() {
    if (this.started) return;

    if (this.starters.size !== 8) {
      alert("Debes seleccionar exactamente 8 titulares.");
      return;
    }

    for (const player of this.players) {
      player.onField = this.starters.has(player.number);
    }

    this.started = true;

    this.match.addEvent("start", {
      description: "Inicio de la primera parte"
    });

    this.timer.start();
    this.render();
  }

  togglePlayer(number) {
    if (!this.started || !this.match.running) return;

    this.timer.tick();

    const player = this.getPlayer(number);

    if (!player) return;

    if (!player.onField &&
        this.match.playersOnField.length >= 8) {
      alert("Primero debes sacar a un jugador.");
      return;
    }

    player.onField = !player.onField;

    this.match.addEvent(
      player.onField ? "entry" : "exit",
      {
        player: player.name,
        number: player.number
      }
    );

    this.render();
  }

  addGoal(number) {
    if (!this.started || this.finished) return;

    this.timer.tick();

    const player = this.getPlayer(number);
    if (!player) return;

    this.match.scoreGoal(player);
    this.render();
  }

  addAssist(number) {
    if (!this.started || this.finished) return;

    this.timer.tick();

    const player = this.getPlayer(number);
    if (!player) return;

    player.assists++;

    this.match.addEvent("assist", {
      player: player.name,
      number: player.number
    });

    this.render();
  }

  addRivalGoal() {
    if (!this.started || this.finished) return;

    this.timer.tick();
    this.match.awayGoals++;

    this.match.addEvent("rivalGoal", {
      score:
        `${this.match.homeGoals}-${this.match.awayGoals}`
    });

    this.render();
  }

  finishMatch() {
    if (!this.started || this.finished) return;

    this.timer.stop();

    if (this.finished) return;

    this.finished = true;

    this.match.addEvent("finish", {
      description: "Final de la primera parte"
    });

    this.render();
  }

  onTimeUp() {
    if (this.finished) return;

    this.finished = true;

    this.match.addEvent("finish", {
      description: "Final de la primera parte"
    });

    this.render();
  }

  formatTime(seconds) {
    const total = Math.max(0, Math.floor(seconds));

    return (
      String(Math.floor(total / 60)).padStart(2, "0") +
      ":" +
      String(total % 60).padStart(2, "0")
    );
  }

  createButton(label, cssClass, action, disabled = false) {
    const button = document.createElement("button");

    button.textContent = label;
    button.className = cssClass;
    button.disabled = disabled;
    button.addEventListener("click", action);

    return button;
  }

  renderPlayers() {
    const container = document.getElementById("jugadores");
    container.replaceChildren();

    for (const player of this.players) {
      const card = document.createElement("article");

      card.className = "jugador";

      if (player.onField) {
        card.classList.add("en-campo");
      }

      if (!this.started &&
          this.starters.has(player.number)) {
        card.classList.add("seleccionado");
      }

      const name = document.createElement("strong");
      name.textContent = player.displayName;

      const time = document.createElement("div");
      time.className = "tiempo";
      time.textContent = player.formattedTime;

      const action = this.createButton(
        !this.started
          ? this.starters.has(player.number)
            ? "✓ TITULAR"
            : "SELECCIONAR"
          : player.onField
            ? "SACAR"
            : "METER",
        player.onField ? "verde" : "gris",
        () => {
          if (!this.started) {
            this.selectStarter(player.number);
          } else {
            this.togglePlayer(player.number);
          }
        },
        this.finished
      );

      const stats = document.createElement("div");
      stats.className = "estadisticas";

      stats.textContent =
        `⚽ ${player.goals} · 👟 ${player.assists}`;

      const controls = document.createElement("details");

      const summary = document.createElement("summary");
      summary.textContent = "Goles / Asistencias";

      const buttons = document.createElement("div");
      buttons.className = "botones-estadisticas";

      buttons.append(
        this.createButton(
          "+ Gol",
          "verde",
          () => this.addGoal(player.number),
          !this.started || this.finished
        ),
        this.createButton(
          "+ Asist.",
          "",
          () => this.addAssist(player.number),
          !this.started || this.finished
        )
      );

      controls.append(summary, buttons);

      card.append(name, time, action, stats, controls);
      container.appendChild(card);
    }
  }

  renderTimeline() {
    const container = document.getElementById("cronologia");
    container.replaceChildren();

    const labels = {
      start: "🏁 Inicio",
      finish: "🏁 Final",
      entry: "🟢 Entra",
      exit: "🔴 Sale",
      goal: "⚽ Gol",
      assist: "👟 Asistencia",
      rivalGoal: "⚽ Gol rival"
    };

    for (const event of [...this.match.events].reverse()) {
      const row = document.createElement("div");
      row.className = "evento";

      const minute = document.createElement("strong");
      minute.textContent = this.formatTime(event.second);

      const description = document.createElement("span");

      description.textContent =
        (labels[event.type] || event.type) +
        (event.player ? ` · ${event.player}` : "") +
        (event.score ? ` · ${event.score}` : "");

      row.append(minute, description);
      container.appendChild(row);
    }
  }

  render() {
    document.getElementById("reloj").textContent =
      this.formatTime(this.match.elapsedSeconds);

    document.getElementById("golesLocal").textContent =
      this.match.homeGoals;

    document.getElementById("golesVisitante").textContent =
      this.match.awayGoals;

    document.getElementById("tituloJugadores").textContent =
      !this.started
        ? `Titulares: ${this.starters.size}/8`
        : `En campo: ${this.match.playersOnField.length}/8`;

    document.getElementById("fase").textContent =
      this.finished
        ? "PRIMERA PARTE FINALIZADA"
        : this.started
          ? "PRIMERA PARTE · EN DIRECTO"
          : "Selecciona 8 titulares";

    document.getElementById("iniciar").disabled =
      this.started;

    document.getElementById("finalizar").disabled =
      !this.match.running;

    document.getElementById("golRival").disabled =
      !this.started || this.finished;

    this.renderPlayers();
    this.renderTimeline();
  }
}

const app = new Application();
app.start();
