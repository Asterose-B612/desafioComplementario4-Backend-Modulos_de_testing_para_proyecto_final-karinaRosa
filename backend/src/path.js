// Importa la función 'fileURLToPath' del módulo 'url' de Node.js.
// Esta función convierte un
import { fileURLToPath } from 'url';
// Importa la función 'dirname' del módulo 'path' de Node.js.
// Esta función devuelve el directorio padre de una ruta de archivo dada.
import { dirname } from 'path';

// Convierte la URL del módulo actual (import.meta.url) en una ruta de archivo absoluta.
// 'import.meta.url' es una propiedad que contiene la URL del módulo actual en ES Modules.
const __filename = fileURLToPath(import.meta.url);

//dirname NO es palabra reservada
//se implementa guiones bajos al trabajar con path
// dirname() toma la ruta de un archivo y devuelve el nombre del directorio padre.
// Se asigna la ruta del directorio actual (__dirname) utilizando la función dirname() con la ruta del archivo (__filename).
export const __dirname = dirname(__filename);
