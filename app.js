document.addEventListener("DOMContentLoaded", function () {

  // PEGA TU URL DE APPS SCRIPT
  var URL = "https://script.google.com/macros/s/AKfycbzjlcR3vrygQBEGVZFNhFYdiB8wx40OYEpCJM_fTyrB9heZBoZkSYu0rrc-P6HSnE6u/exec";

  // PANTALLA INICIAL
  document.getElementById("contenido").innerHTML = `
  <div class="pantalla azul">

    <img src="logo.png" class="logo">

    <h1 class="titulo">
      SECUNDARIA CON DIFICULTAD ACADEMICA
    </h1>

    <p class="subtitulo">
      COLEGIO BRITANICO SANTA CRUZ
    </p>

    <img src="profesor.jpg" class="profesor">
Jerónimo Rojas Gutierrez
    <p style="margin-top:25px;">
      Bienvenidos al Sistema Académico
    </p>

  </div>
`;

  // IR A AVISOS
  setTimeout(cargarAvisos, 3000);

  // CARGAR AVISOS
  function cargarAvisos() {

    document.getElementById("contenido").innerHTML = `
<div class="container" style="
  height:100vh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
">

        <h2 style="text-align:center;">
          A V I S O S
        </h2>

      <div id="lista" style="
  flex:1;
  overflow-y:auto;
  padding-bottom:15px;
">
          Cargando...
        </div>

      <div style="
  position:sticky;
  top:0;
  z-index:100;
  background:#eef3f8;
 padding:45px 15px 15px 15px;
  flex-shrink:0;
">

  <button
    class="boton"
    onclick="continuarApp()">

    Continuar

  </button>

</div>
      </div>
    `;

    fetch(URL + "?accion=avisos")
      .then(r => r.json())
      .then(data => {
        window.avisosActuales = data;

        let html = "";

        data.forEach(a => {

          html += `
            <div class="card">
              <b>${a.mensaje}</b><br><br>
              ${a.fecha}
            </div>
          `;

        });

        document.getElementById("lista").innerHTML = html;

      })
      .catch(() => {

        document.getElementById("lista").innerHTML =
          "Error al cargar avisos";

      });

  }

  // LOGIN
  // CONTINUAR
window.continuarApp = function () {

  let usuario =
    localStorage.getItem(
      "usuarioGuardado"
    );

  let password =
    localStorage.getItem(
      "passwordGuardado"
    );

  // SI YA INICIO SESION
  if (usuario && password) {

    fetch(
      URL +
      "?usuario=" + usuario +
      "&password=" + password
    )

    .then(r => r.json())

    .then(data => {

      if (data.status == "ok") {

        mostrarPanel(data);

      } else {

        irLogin();

      }

    });

  } else {

    irLogin();

  }

}
  window.irLogin = function () {

    document.getElementById("contenido").innerHTML = `
      <div class="container">

 <h2 style="text-align:center;">
  Iniciar Sesión
</h2>

<img
  src="logo.png"
  class="logo"
  style="
    width:90px;
    display:block;
    margin:auto;
  ">

        <input
          type="text"
          id="u"
          class="input"
          placeholder="Usuario">

        <input
          type="password"
          id="p"
          class="input"
          placeholder="Contraseña">

        <button
          class="boton"
          onclick="login()">

          Ingresar

        </button>

      </div>
    `;

  }

  // LOGIN FUNCION
  window.login = function () {

    let u = document.getElementById("u").value;
    let p = document.getElementById("p").value;

    fetch(URL + "?usuario=" + u + "&password=" + p)

      .then(r => r.json())

      .then(data => {

        if (data.status == "ok") {

  // GUARDAR SESION
  localStorage.setItem(
    "usuarioGuardado",
    u
  );

  localStorage.setItem(
    "passwordGuardado",
    p
  );

  mostrarPanel(data);

} else {

          alert("Datos incorrectos");

        }

      })

      .catch(() => {

        alert("Error de conexión");

      });

  }

  // PANEL
function mostrarPanel(data) {

  window.notasActuales = data.notas;
  window.disciplinaActual = data.disciplina;
  window.academicoActual = data.academico;
  window.notificaciones = [];

// AVISOS
if(window.avisosActuales){

  window.avisosActuales.forEach(a => {

    window.notificaciones.push({
      tipo: "📢 Aviso",
      fecha: a.fecha,
      detalle: a.mensaje
    });

  });

}

// NOTAS
data.notas.forEach(n => {

  window.notificaciones.push({
    tipo: "📘 Nota",
    fecha: "Actualización",
    detalle:
      n.materia +
      " → " +
      n.nota
  });

});

// DISCIPLINA
data.disciplina.forEach(d => {

  window.notificaciones.push({
    tipo: "⚠️ Disciplina",
    fecha: d.fecha,
    detalle: d.detalle
  });

});

// ACADEMICO
data.academico.forEach(a => {

  window.notificaciones.push({
    tipo: "🎓 Académico",
    fecha: a.fecha,
    detalle: a.detalle
  });

});
  window.nombreAlumno = data.nombre;
  console.log(data.usuario);

  let html = `

    <div class="container">

      <div class="topbar">

        <div class="topbar-content">

          <div class="topbar-left">

            <img
              src="logo.png"
              class="topbar-logo">
<img
  src="https://jeronimo1970rojas-lab.github.io/${data.usuario}.jpg"
  style="
    width:55px;
    height:55px;
    border-radius:50%;
    object-fit:cover;
    border:3px solid white;
     "
  onerror="this.src='logo.png'">
            <div>
              <h2>${data.nombre}</h2>
              <p>PRE-PROMO "B"</p>
            </div>

          </div>

<div style="
  display:flex;
  align-items:center;
  gap:10px;
">

  <div
    onclick="mostrarNotificaciones()"
    style="
      position:relative;
      cursor:pointer;
      font-size:26px;
    ">

    🔔

    <span id="badgeNotif" style="
      position:absolute;
      top:-6px;
      right:-10px;
      background:red;
      color:white;
      border-radius:50%;
      min-width:18px;
      height:18px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:10px;
      font-weight:bold;
      padding:2px;
    ">
      0
    </span>

  </div>

  <button
    onclick="cerrarSesion()"
    style="
      background:white;
      border:none;
      padding:10px 14px;
      border-radius:12px;
      color:#1565c0;
      font-weight:bold;
    ">

    Salir

  </button>

</div>

        </div>

      </div>

      <div
        id="contenidoPanel"
        style="padding-top:10px;">
      </div>

    </div>

    <div class="bottom-nav">

      <button
        class="nav-btn"
        onclick="mostrarInicio()">

        <span class="nav-icon">🏠</span>
        Inicio

      </button>

      <button
        class="nav-btn"
        onclick="mostrarNotas()">

        <span class="nav-icon">📘</span>
        Notas

      </button>

      <button
        class="nav-btn"
        onclick="mostrarDisciplina()">

        <span class="nav-icon">⚠️</span>
        Disciplina

      </button>
<button
  class="nav-btn"
  onclick="mostrarAcademico()">

  <span class="nav-icon">🎓</span>
  Academico

</button>
    </div>

  `;

  document.getElementById(
    "contenido"
  ).innerHTML = html;

  mostrarInicio();

}
// CERRAR SESION
window.cerrarSesion = function () {

  localStorage.removeItem(
    "usuarioGuardado"
  );

  localStorage.removeItem(
    "passwordGuardado"
  );

  location.reload();

}
// MOSTRAR NOTAS
window.mostrarNotas = function(){

  let notas = window.notasActuales;

  let html = "";

  notas.forEach(n => {

    let clase = "nota-verde";

    if(n.nota < 51){
      clase = "nota-roja";
    }
    else if(n.nota < 70){
      clase = "nota-amarilla";
    }

    html += `

      <div class="card ${clase}">

        <div class="card-title">
          📘 ${n.materia}
        </div>

        Nota: ${n.nota}

      </div>

    `;

  });

  document.getElementById(
    "contenidoPanel"
  ).innerHTML = html;

}
// MOSTRAR DISCIPLINA
window.mostrarDisciplina = function(){

  let disciplina =
    window.disciplinaActual;

  let html = "";

  if(disciplina.length == 0){

    html = `
      <div class="card">

        <div class="card-title">
          ✅ Excelente
        </div>

        Sin registros disciplinarios

      </div>
    `;

  } else {

    disciplina.forEach(d => {

      html += `

        <div class="card">

          <div class="card-title">
            ⚠️ ${d.fecha}
          </div>

          ${d.detalle}

        </div>

      `;

    });

  }

  document.getElementById(
    "contenidoPanel"
  ).innerHTML = html;

}
  window.mostrarInicio = function(){

  let promedio = 0;

  if(window.notasActuales.length > 0){

    window.notasActuales.forEach(n => {
      promedio += Number(n.nota);
    });

    promedio = (
      promedio /
      window.notasActuales.length
    ).toFixed(1);

  }

  document.getElementById(
    "contenidoPanel"
  ).innerHTML = `

    <div class="card">

      <div class="card-title">
        👋 BIENVENID@
      </div>
      
      ${window.nombreAlumno}

    </div>

    <div class="card">

      <div class="card-title">
        ⭐ PROMEDIO GENERAL DEL TRIMESTRE 
      </div>

      <div style="
        font-size:42px;
        font-weight:bold;
        color:#1565c0;
        text-align:center;
      ">
        ${promedio}
      </div>

    </div>

  `;

}
});
window.mostrarAcademico = function(){

  let academico =
    window.academicoActual;

  let html = "";

  if(academico.length == 0){

    html = `
      <div class="card">

        <div class="card-title">
          🎓 Excelente
        </div>

        Sin observaciones académicas

      </div>
    `;

  } else {

    academico.forEach(a => {

      html += `

        <div class="card">

          <div class="card-title">
            🎓 ${a.fecha}
          </div>

          ${a.detalle}

        </div>

      `;

    });

  }

  document.getElementById(
    "contenidoPanel"
  ).innerHTML = html;

}
window.mostrarNotificaciones = function(){

  let html = "";

  if(window.notificaciones.length == 0){

    html = `
      <div class="card">
        Sin notificaciones
      </div>
    `;

  } else {

    window.notificaciones.forEach(n => {

      html += `

        <div class="card">

          <div class="card-title">
            🔔 ${n.tipo}
            <div style="
  font-size:12px;
  color:gray;
  margin-bottom:8px;
">
  ${n.fecha}
</div>
          </div>

          ${n.detalle}

        </div>

      `;

    });

  }

  document.getElementById(
    "contenidoPanel"
  ).innerHTML = `

    <h2 style="
      margin-bottom:15px;
      color:#1565c0;
    ">
      Notificaciones
    </h2>

    ${html}

  `;

}
