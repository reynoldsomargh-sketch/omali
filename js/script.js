//=========================================
// OMALI - Sistema de Pedidos
//=========================================

// ID de tu Google Sheets
const SHEET_ID = "11EafCgGldYFmfDklcF5JQl5jAf0Gk-ovK8az1jgwYzE";

// Variables globales
let pedidos = [];
let clientes = [];
let pedidosCompletos = [];

//-----------------------------------------
// Iniciar aplicación
//-----------------------------------------

google.charts.load("current");

google.charts.setOnLoadCallback(iniciar);

async function iniciar(){

    actualizarFechaHora();

    setInterval(actualizarFechaHora,1000);

    await cargarDatos();

}

//-----------------------------------------
// Fecha y hora
//-----------------------------------------

function actualizarFechaHora(){

    const ahora = new Date();

    document.getElementById("fecha").innerHTML =
        ahora.toLocaleDateString("es-MX");

    document.getElementById("hora").innerHTML =
        ahora.toLocaleTimeString("es-MX");

}

//-----------------------------------------
// Cargar información
//-----------------------------------------

async function cargarDatos(){

    pedidos = await leerHoja("Pedidos");

    clientes = await leerHoja("Clientes");

    console.log("Pedidos:", pedidos);

    console.log("Clientes:", clientes);

}
//-----------------------------------------
// Leer Google Sheets
//-----------------------------------------

async function leerHoja(nombreHoja){

    const url =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(nombreHoja)}`;

    const respuesta = await fetch(url);

    const texto = await respuesta.text();

    const json = JSON.parse(

        texto.substring(47).slice(0,-2)

    );

    return convertir(json.table);

}

//-----------------------------------------
// Convertir datos
//-----------------------------------------

function convertir(tabla){

    const columnas = tabla.cols.map(c=>c.label);

    return tabla.rows.map(fila=>{

        let objeto={};

        fila.c.forEach((celda,i)=>{

            objeto[columnas[i]] = celda ? celda.v : "";

        });

        return objeto;

    });

}