import multer from 'multer';

// Configuración para el almacenamiento de imágenes
const STORAGE = multer.diskStorage({
    // Establece la carpeta de destino como 'src/public/img'
    destination: (req, file, callback) => {
        // Llama al callback sin errores y especifica la carpeta de destino donde se almacenan las imágenes
        callback(null, 'src/public/img');
    },

    // Define el nombre de archivo como una marca de tiempo seguida del nombre original
    filename: (req, file, cb) => {
        // Llama al callback sin errores y establece el nombre del archivo utilizando una marca de tiempo seguida del nombre original del archivo
        cb(null, `${Date.now()}${file.originalname}`);
    }
});

// Genera un objeto que configura Multer con la opción de almacenamiento definida
const upload = multer({ storage: STORAGE });

// Exporta el objeto configurado de Multer para su uso en otros módulos
export default upload;
