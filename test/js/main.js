import { Player } from "./models/Player.js";
import { Match } from "./models/Match.js";
import { MatchTimer } from "./services/MatchTimer.js";

/**
 * Aplicación de control de minutos
 * Benxamín C - U.D. Santa Mariña
 *
 * Entorno: TEST
 * Arquitectura: JavaScript ES6 + clases
 *
 * No utiliza Firebase de producción.
 */
class Application {
  constructor() {
    this.squad = [
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

    // Crear los objetos Player
    this.players = this.squad.map(
      ([number, name]) => new Player(number, name)
    );

    // Crear el partido de pruebas
    this.match = new Match(
      "Rival de prueba",
      this.players,
      25 * 60
    );

    // Crear el servicio de cronómetro
    this.timer = new MatchTimer(
      this.match,
      () => this.render()
    );
  }

  /**
   * Inicializar aplicación
   */
  start() {
    const status = document.getElementById("estado");

    if (status) {
      status.textContent =
        "✅ TEST · Aplicación orientada a objetos inicializada";
    }

    this.render();
  }

  /**
   * Dibujar las tarjetas de jugadores
   */
  renderPlayers() {
    const container = document.getElementById("jugadores");

    if (!container) {
      console.error("No existe el contenedor #jugadores");
      return;
    }

    container.replaceChildren();

    for (const player of this.players) {
      const card = document.createElement("div");
      card.className = "jugador";

      const title = document.createElement("strong");
      title.textContent = player.displayName;

      const time = document.createElement("p");
      time.textContent = player.formattedTime;

      const goals = document.createElement("p");
      goals.textContent = `⚽ Goles: ${player.goals}`;

      const assists = document.createElement("p");
      assists.textContent = `👟 Asistencias: ${player.assists}`;

      card.append(
        title,
        time,
        goals,
        assists
      );

      container.appendChild(card);
    }
  }

  /**
   * Actualizar la interfaz
   */
  render() {
    this.renderPlayers();
  }
}

// Arrancar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  const app = new Application();
  app.start();
});
