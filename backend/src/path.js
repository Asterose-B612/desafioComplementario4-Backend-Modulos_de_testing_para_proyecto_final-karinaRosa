// Importa la función 'fileURLToPath' del módulo 'url' de Node.js.
// Esta función convierte una URL de archivo (file URL) en una ruta de archivo (file path).
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
//// Obtiene el directorio del archivo actual a partir de su ruta absoluta.
// 'dirname(__filename)' devuelve el nombre del directorio que contiene el archivo actual.
const __dirname = dirname(__filename);

// Exporta la variable '__dirname' como la exportación predeterminada del módulo.
// Esto permite que otros módulos importen '__dirname' para obtener el directorio del archivo actual.
//en este caso lo importa index.js
export default __dirname