// ==============================================
// OMALI ERP
// Login
// ==============================================

let usuarioActual = null;

//------------------------------------------
// Al cargar la página
//------------------------------------------

window.addEventListener("load", iniciarLogin);

async function iniciarLogin() {

    // ¿Existe una sesión guardada?

    const sesion = localStorage.getItem("usuario");

    if (sesion) {

        usuarioActual = JSON.parse(sesion);

        mostrarDashboard();

        return;

    }

    document
        .getElementById("btnLogin")
        .addEventListener("click", validarLogin);

    document
        .getElementById("btnSalir")
        .addEventListener("click", cerrarSesion);

}

//------------------------------------------
// Validar usuario
//------------------------------------------

async function validarLogin() {

    const usuario = document
        .getElementById("usuario")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    const usuarios = await obtenerUsuarios();

    console.log("Usuarios leídos:");
    
    console.table(usuarios);

    const encontrado = usuarios.find(u =>

        String(u.Usuario).toLowerCase() === usuario.toLowerCase()

        &&

        String(u.Password) === password

        &&

        String(u.Activo).toUpperCase() === "SI"

    );

    if (!encontrado) {

        document.getElementById("mensaje").innerHTML =
            "Usuario o contraseña incorrectos.";

        return;

    }

    usuarioActual = encontrado;

    localStorage.setItem(

        "usuario",

        JSON.stringify(encontrado)

    );

    mostrarDashboard();

}

//------------------------------------------
// Mostrar Dashboard
//------------------------------------------

function mostrarDashboard() {

    document.getElementById("login").style.display = "none";

    document.getElementById("dashboard").style.display = "block";

    document.getElementById("nombreUsuario").innerHTML =
        usuarioActual.Nombre;

    document.getElementById("rolUsuario").innerHTML =
        usuarioActual.Rol;

    document.getElementById("bienvenida").innerHTML =
        usuarioActual.Nombre;

    document.getElementById("mensaje").innerHTML = "";

}

//------------------------------------------
// Cerrar sesión
//------------------------------------------

function cerrarSesion() {

    localStorage.removeItem("usuario");

    location.reload();

}
