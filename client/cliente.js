// ===============================
// LANDING
// ===============================

const landing = document.getElementById("landing");
const app = document.getElementById("app");

landing.addEventListener("click", () => {

  landing.style.opacity = "0";

  setTimeout(() => {

    landing.style.display = "none";
    app.style.display = "flex";

  }, 500);

});

// ===============================
// ELEMENTOS
// ===============================

const input = document.getElementById("searchInput");
const btn = document.getElementById("btnSearch");
const resultados = document.getElementById("resultados");

// ===============================
// BUSCAR CANCIONES
// ===============================

async function buscarCanciones() {

  const q = input.value.trim();

  if (!q) return;

  resultados.innerHTML = `
    <p style="color:#888;">
      Buscando...
    </p>
  `;

  try {

    const resp = await fetch(
      `https://otro-tema-app.onrender.com/api/search?q=${encodeURIComponent(q)}`
    );

    const data = await resp.json();

    if (!resp.ok) {

      resultados.innerHTML = `
        <p style="color:#ff5555;">
          Error al buscar canciones.
        </p>
      `;

      return;
    }

    mostrarResultados(data);

  } catch (err) {

    resultados.innerHTML = `
      <p style="color:#ff5555;">
        Error de conexión.
      </p>
    `;
  }
}

// ===============================
// MOSTRAR RESULTADOS
// ===============================

function mostrarResultados(tracks) {

  resultados.innerHTML = "";

  if (!tracks.length) {

    resultados.innerHTML = `
      <p style="color:#888;">
        No se encontraron canciones.
      </p>
    `;

    return;
  }

  tracks.forEach(track => {

    const div = document.createElement("div");

    div.className = "track";

    div.innerHTML = `

      <img
        src="${
          track.album.images?.[2]?.url ||
          track.album.images?.[0]?.url ||
          ""
        }"
        alt=""
      >

      <div class="track-info">

        <div class="track-name">
          ${track.name}
        </div>

        <div class="track-artist">
          ${track.artists[0].name}
        </div>

      </div>

      <button>
        Agregar
      </button>

    `;

    div.querySelector("button").addEventListener("click", () => {
      agregarTema(track.uri);
    });

    resultados.appendChild(div);

  });

}

// ===============================
// AGREGAR A LA COLA
// ===============================

async function agregarTema(uri) {

  try {

    const resp = await fetch(
      "https://otro-tema-app.onrender.com/api/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trackUri: uri
        })
      }
    );

    const data = await resp.json();

    if (resp.ok) {

      alert("🎵 Tema agregado a la cola");

    } else {

      alert("Error: " + data.error);

    }

  } catch (error) {

    alert("Error de conexión");

  }

}

// ===============================
// EVENTOS
// ===============================

btn.addEventListener("click", buscarCanciones);

input.addEventListener("keypress", e => {

  if (e.key === "Enter") {
    buscarCanciones();
  }

});
