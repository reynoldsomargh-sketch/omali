// ==============================================
// OMALI ERP
// API Google Sheets
// ==============================================

// ID de tu Google Sheets
const SHEET_ID = "11EafCgGldYFmfDklcF5JQl5jAf0Gk-ovK8az1jgwYzE";

/*
==============================================
Leer cualquier hoja
==============================================
*/

async function leerHoja(nombreHoja){

    try{

        const url =
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(nombreHoja)}`;

        const respuesta = await fetch(url);

        const texto = await respuesta.text();

        const json = JSON.parse(
            texto.substring(47).slice(0,-2)
        );

        return convertirTabla(json.table);

    }

    catch(error){

        console.error("Error leyendo:",nombreHoja);

        console.error(error);

        return [];

    }

}

/*
==============================================
Convertir Google Sheets a objetos
==============================================
*/

function convertirTabla(tabla){

    const columnas = tabla.cols.map(col=>col.label);

    return tabla.rows.map(fila=>{

        let objeto={};

        fila.c.forEach((celda,i)=>{

            objeto[columnas[i]] =
                celda ? (celda.f || celda.v) : "";

        });

        return objeto;

    });

}

/*
==============================================
Usuarios
==============================================
*/

async function obtenerUsuarios(){

    return await leerHoja("Usuarios");

}

/*
==============================================
Clientes
==============================================
*/

async function obtenerClientes(){

    return await leerHoja("Clientes");

}

/*
==============================================
Pedidos
==============================================
*/

async function obtenerPedidos(){

    return await leerHoja("Pedidos");

}
