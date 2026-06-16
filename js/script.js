// =========================================
// OMALI - Sistema de Pedidos
// =========================================

const SHEET_ID = "11EafCgGldYFmfDklcF5JQl5jAf0Gk-ovK8az1jgwYzE";

google.charts.load("current");
google.charts.setOnLoadCallback(iniciar);

async function iniciar() {

    mostrarFechaHora();

    try {

        const pedidos = await leerHoja("Pedidos");
        const clientes = await leerHoja("Clientes");

        console.log("PEDIDOS", pedidos);
        console.log("CLIENTES", clientes);

        alert("Pedidos: " + pedidos.length + "\nClientes: " + clientes.length);

    } catch (error) {

        console.error(error);
        alert("Error leyendo Google Sheets");

    }

}

function mostrarFechaHora() {

    setInterval(() => {

        const ahora = new Date();

        document.getElementById("fecha").textContent =
            ahora.toLocaleDateString("es-MX");

        document.getElementById("hora").textContent =
            ahora.toLocaleTimeString("es-MX");

    }, 1000);

}

async function leerHoja(nombre) {

    const url =
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${nombre}`;

    const respuesta = await fetch(url);

    const texto = await respuesta.text();

    const json = JSON.parse(
        texto.substring(47).slice(0, -2)
    );

    return convertir(json.table);

}

function convertir(tabla) {

    const columnas = tabla.cols.map(col => col.label);

    return tabla.rows.map(fila => {

        let objeto = {};

        fila.c.forEach((celda, i) => {

            objeto[columnas[i]] = celda ? (celda.f || celda.v) : "";

        });

        return objeto;

    });

}
