//Acá especifico lo que necesito para trabajar con winston logger

import winston from "winston"; // Importa la biblioteca 'winston' para el registro de logs

// Objeto donde se especifican los niveles y sus respectivos colores, determinando el nivel de urgencia
const customLevelOpt = {
    // Definición de los niveles de logs, indicando la urgencia de cada uno
    levels: {
        fatal: 0,
        // Nivel más alto de urgencia, para eventos críticos que requieren atención inmediata YAAA
        error: 1,
        // Nivel para errores que necesitan ser revisados y solucionados. ej.se cayó al otro día lo puedo volver a levantar
        warning: 2,
        // Nivel para advertencias que no son críticas pero que necesitan atención
        info: 3,
        // Nivel para información general sobre el funcionamiento de la aplicación
        http: 4,
        // Nivel para información sobre solicitudes HTTP
        debug: 5
        // Nivel más bajo de urgencia, usado para mensajes de depuración detallados
    },
    // Definición de los colores asociados a cada nivel de logs
    colors: {
        fatal: 'red',
        // Color rojo para el nivel fatal
        error: 'orange',
        // Color naranja para el nivel de error
        warning: 'yellow',
        // Color amarillo para el nivel de advertencia
        info: 'blue',
        // Color azul para el nivel de información
        http: 'white',
        // Color blanco para el nivel de HTTP
        debug: 'cyan'
        // Color cian para el nivel de depuración
    }
};



// 1°  Creación de logger utilizando la biblioteca Winston, utilizando winston.createLogger()
const logger = winston.createLogger({
    //Se especifican los niveles de logs utilizando los niveles definidos en customLevelOpt.levels.
    levels: customLevelOpt.levels,

    // 2° Configuración del transporte para la salida de logs a la consola, "especifico el formato, como quiero que se trabajen cada uno de ellos"
    transports: [
       // Se utiliza new winston.transports.Console() para especificar que los logs se enviarán a la consola.
        new winston.transports.Console({
           // Se establece el nivel de logs en 'info', lo que significa que solo se registrarán mensajes de nivel 'info' y superiores.
            level: 'info',
            //Se utiliza winston.format.combine() para combinar los formatos de logs.
            format: winston.format.combine( 
                // Se utiliza winston.format.colorize() para aplicar colores a los mensajes de logs, utilizando los colores definidos en customLevelOpt.colors.
                winston.format.colorize({ color: customLevelOpt.colors }), 
                // Se utiliza winston.format.simple() para formatear los mensajes de logs de una manera simple y legible.
                winston.format.simple() 
            )
        })
    ]
});
