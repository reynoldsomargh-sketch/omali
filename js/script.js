// =============================================
// OMALI - Sistema de Pedidos de Agua
// =============================================

const SHEET_ID = "11EafCgGldYFmfDklcF5JQl5jAf0Gk-ovK8az1jgwYzE";

let pedidos = [];
let clientes = [];
let pedidosCompletos = [];

google.charts.load("current");
google.charts.setOnLoadCallback(iniciar);

//==============================================
// INICIAR
//==============================================

async function iniciar() {

    actualizarFechaHora();

    setInterval(actualizarFechaHora,1000);

    await cargarDatos();

}

//==============================================
// FECHA Y HORA
//==============================================

function actualizarFechaHora(){

    const ahora = new Date();

    document.getElementById("fecha").textContent =
        ahora.toLocaleDateString("es-MX");

    document.getElementById("hora").textContent =
        ahora.toLocaleTimeString("es-MX");

}

//==============================================
// CARGAR DATOS
//==============================================

async function cargarDatos(){

    pedidos = await leerHoja("Pedidos");

    clientes = await leerHoja("Clientes");

    unirDatos();

    llenarTabla();

    contarEstados();

    document.getElementById("ultimaActualizacion").textContent =
        new Date().toLocaleTimeString("es-MX");

}

//==============================================
// LEER GOOGLE SHEETS
//==============================================

async function leerHoja(nombre){

    const url =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(nombre)}`;

    const respuesta = await fetch(url);

    const texto = await respuesta.text();

    const json = JSON.parse(
        texto.substring(47).slice(0,-2)
    );

    return convertir(json.table);

}

//==============================================
// CONVERTIR
//==============================================

function convertir(tabla){

    const columnas = tabla.cols.map(c => c.label);

    return tabla.rows.map(fila => {

        let objeto = {};

        fila.c.forEach((celda,i)=>{

            objeto[columnas[i]] = celda ? (celda.f || celda.v) : "";

        });

        return objeto;

    });

}

//==============================================
// UNIR PEDIDOS Y CLIENTES
//==============================================

function unirDatos(){

    pedidosCompletos = pedidos.map(pedido => {

        const cliente = clientes.find(c => c.ID == pedido.ClienteID);

        return {

            pedido: pedido.PedidoID,

            fecha: pedido.Fecha,

            hora: pedido.Hora,

            cliente: cliente ? cliente.Nombre : "Sin Cliente",

            colonia: cliente ? cliente.Colonia : "",

            direccion: cliente ? cliente.Dirección : "",

            cantidad: pedido.Cantidad,

            estado: pedido.Estado,

            repartidor: pedido.Repartidor

        };

    });

}

//==============================================
// LLENAR TABLA
//==============================================

function llenarTabla(){

    const tbody = document.getElementById("tablaPedidos");

    tbody.innerHTML = "";

    pedidosCompletos.forEach(p=>{

        tbody.innerHTML += `

        <tr>

            <td>${p.pedido}</td>

            <td>${p.fecha}</td>

            <td>${p.hora}</td>

            <td>${p.cliente}</td>

            <td>${p.colonia}</td>

            <td>${p.direccion}</td>

            <td>${p.cantidad}</td>

            <td>${p.estado}</td>

            <td>${p.repartidor}</td>

        </tr>

        `;

    });

}

//==============================================
// CONTADORES
//==============================================

function contarEstados(){

    const contar = estado =>
        pedidos.filter(p=>p.Estado===estado).length;

    document.getElementById("totalEntregado").textContent =
        contar("Entregado");

    document.getElementById("totalRecibido").textContent =
        contar("Recibido");

    document.getElementById("totalLlenado").textContent =
        contar("En Llenado");

    document.getElementById("totalListo").textContent =
        contar("Listo para Entrega");

    document.getElementById("totalRuta").textContent =
        contar("En Ruta");

    document.getElementById("totalCobrado").textContent =
        contar("Cobrado");

    document.getElementById("totalCancelado").textContent =
        contar("Cancelado");

}
