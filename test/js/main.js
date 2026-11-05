class Jugador {
  constructor(dorsal, nombre) {
    this.dorsal = dorsal;
    this.nombre = nombre;
    this.segundosJugados = 0;
    this.goles = 0;
    this.asistencias = 0;
  }

  get nombreCompleto() {
    return `${this.dorsal} · ${this.nombre}`;
  }
}

class Aplicacion {
  constructor() {
    this.jugadores = [
      new Jugador(1, "Mauro"),
      new Jugador(3, "Javi"),
      new Jugador(4, "Elías"),
      new Jugador(5, "Brais"),
      new Jugador(6, "Xabi"),
      new Jugador(7, "Roque"),
      new Jugador(8, "Leo Estévez"),
      new Jugador(9, "Thiago"),
      new Jugador(10, "Enzo"),
      new Jugador(11, "Angelo"),
      new Jugador(12, "Xes"),
      new Jugador(14, "Leo Mendes")
    ];
  }

  iniciar() {
    document.getElementById("estado").textContent =
      "✅ Aplicación orientada a objetos inicializada";

    this.mostrarJugadores();
  }

  mostrarJugadores() {
    const contenedor = document.getElementById("jugadores");
    contenedor.replaceChildren();

    for (const jugador of this.jugadores) {
      const tarjeta = document.createElement("div");
      tarjeta.className = "jugador";
      tarjeta.textContent = jugador.nombreCompleto;
      contenedor.appendChild(tarjeta);
    }
  }
}

const app = new Aplicacion();
app.iniciar();
