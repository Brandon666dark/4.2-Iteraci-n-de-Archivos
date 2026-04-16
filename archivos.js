/**
 * Tarea: 4.2 Iteración de Archivos
 * Alumno: Brandon Rodriguez Villanueva
 * Descripcion: Uso del modulo fs para creacion, lectura, validacion y busqueda de datos.
 */

const fs = require('fs');
const readline = require('readline');

// Configuración de la interfaz de consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ARCHIVO_DATOS = 'datos.txt';
const ARCHIVO_RESULTADO = 'resultado.txt';
let nombres = [];

// ---Creacion y captura de nombres ---
function iniciarActividad() {
    console.log("--- Registro de Nombres ---");
    pedirNombres();
}

function pedirNombres() {
    rl.question(`Ingrese el nombre ${nombres.length + 1} (mínimo 5): `, (nombre) => {
        const n = nombre.trim();

        //Validaciones
        if (n === "") {
            console.log("Error: El nombre no puede estar vacío.");
            pedirNombres();
        } else if (nombres.includes(n)) {
            console.log("Error: Este nombre ya fue ingresado.");
            pedirNombres();
        } else {
            nombres.push(n);
            if (nombres.length < 5) {
                pedirNombres();
            } else {
                procesarDatos();
            }
        }
    });
}

// --- Procesamiento y Escritura ---
function procesarDatos() {
    try {
        // Guardar nombres en datos.txt
        fs.writeFileSync(ARCHIVO_DATOS, nombres.join('\n'));

        //Validar si el archivo existe
        if (!fs.existsSync(ARCHIVO_DATOS)) {
            throw new Error("El archivo datos.txt no fue encontrado.");
        }

        // Leer contenido usando fs.readFileSync
        const contenido = fs.readFileSync(ARCHIVO_DATOS, 'utf-8');
        
        if (!contenido.trim()) {
            console.log("El archivo está vacío.");
            return;
        }

        // Procesar datos (Mayusculas, total, longitud, orden)
        const listaNombres = contenido.split('\n');
        const listaMayusculas = listaNombres.map(n => n.toUpperCase());
        const listaOrdenada = [...listaNombres].sort((a, b) => a.localeCompare(b));
        const nombreMasLargo = listaNombres.reduce((a, b) => a.length >= b.length ? a : b);

        // Mostrar resultados en consola
        console.log("\n--- Datos Procesados ---");
        console.log("Total de nombres:", listaNombres.length);
        console.log("Nombre más largo:", nombreMasLargo);
        console.log("Lista ordenada:", listaOrdenada);

        // Escritura de resultado.txt
        const contenidoResultado = `
Lista original: ${listaNombres.join(', ')}
Lista en mayúsculas: ${listaMayusculas.join(', ')}
Lista ordenada: ${listaOrdenada.join(', ')}
Total de nombres: ${listaNombres.length}`;

        fs.writeFileSync(ARCHIVO_RESULTADO, contenidoResultado.trim());
        console.log(`\nArchivo '${ARCHIVO_RESULTADO}' generado con éxito.`);

        // Llamar a la busqueda
        solicitarBusqueda();

    } catch (err) {
        console.error("Error:", err.message);
        rl.close();
    }
}

// --- Buscar nombre---
function solicitarBusqueda() {
    console.log("\n--- Buscador de Nombres ---");
    rl.question("Ingrese el nombre que desea buscar en el archivo: ", (nombreABuscar) => {
        const contenido = fs.readFileSync(ARCHIVO_DATOS, 'utf-8');
        const listaNombres = contenido.split('\n');
        
        let coincidencias = 0;

        //Iterar los datos
        listaNombres.forEach(nombre => {
            if (nombre.trim().toLowerCase() === nombreABuscar.trim().toLowerCase()) {
                coincidencias++;
            }
        });

        if (coincidencias > 0) {
            console.log(`\n¡Encontrado! El nombre "${nombreABuscar}" aparece ${coincidencias} vez/veces.`);
        } else {
            console.log(`\nEl nombre "${nombreABuscar}" no se encontró.`);
        }

        console.log("\nActividad finalizada.");
        rl.close(); 
    });
}

iniciarActividad();