const fs = require('fs');
const readline = require('readline');

// Configuración para la entrada de datos por consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const archivoDatos = 'datos.txt';
const archivoResultado = 'resultado.txt';

/*Creación y captura de datos*/
const nombres = [];

console.log("Ingrese al menos 5 nombres (escriba 'salir' para terminar):");

rl.on('line', (input) => {
    if (input.toLowerCase() === 'salir') {
        if (nombres.length < 5) {
            console.log(`Faltan nombres. Por favor ingrese al menos ${5 - nombres.length} más.`);
        } else {
            procesarArchivos();
            rl.close();
        }
        return;
    }

    // Validación: Evitar guardar nombres duplicados
    if (nombres.includes(input.trim())) {
        console.log("Este nombre ya fue ingresado. Intente con otro.");
    } else if (input.trim() !== "") {
        nombres.push(input.trim());
        console.log(`Nombres registrados: ${nombres.length}`);
    }
});

function procesarArchivos() {
    try {
        // Guardar nombres en datos.txt
        fs.writeFileSync(archivoDatos, nombres.join('\n'));

        // Validaciones
        if (!fs.existsSync(archivoDatos)) {
            console.error("Error: El archivo datos.txt no existe.");
            return;
        }

        // Leer contenido usando fs.readFileSync
        const contenido = fs.readFileSync(archivoDatos, 'utf-8');

        if (contenido.trim() === "") {
            console.log("Notificación: El archivo está vacío.");
            return;
        }

        // Mostrar contenido completo en consola
        console.log("\n--- Contenido de datos.txt ---");
        console.log(contenido);

        /*Procesamiento de datos*/
        const listaNombres = contenido.split('\n').filter(n => n.trim() !== "");
        
        console.log("\n--- Procesamiento ---");
        let nombreMasLargo = "";
        const listaMayusculas = listaNombres.map(nombre => {
            const mayus = nombre.toUpperCase();
            console.log(mayus);
            
            if (nombre.length > nombreMasLargo.length) {
                nombreMasLargo = nombre;
            }
            return mayus;
        });

        const totalNombres = listaNombres.length;
        const listaOrdenada = [...listaNombres].sort((a, b) => a.localeCompare(b));

        console.log(`Total de nombres: ${totalNombres}`);
        console.log(`Nombre con mayor longitud: ${nombreMasLargo}`);
        console.log("Nombres ordenados:", listaOrdenada);

        
         /* Escritura de resultados*/
        const contenidoResultado = [
            "--- Lista Original ---",
            listaNombres.join('\n'),
            "\n--- Lista en Mayúsculas ---",
            listaMayusculas.join('\n'),
            "\n--- Lista Ordenada Alfabéticamente ---",
            listaOrdenada.join('\n'),
            `\nTotal de nombres: ${totalNombres}`
        ].join('\n');

        fs.writeFileSync(archivoResultado, contenidoResultado);
        console.log(`\nResultados guardados con éxito en ${archivoResultado}`);

    } catch (error) {
        console.error("Ocurrió un error inesperado:", error.message);
    }
}