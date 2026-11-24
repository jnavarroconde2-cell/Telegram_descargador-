const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
const TOKEN = '9087778104:AAEwlyzptGIwaArDnCdQcP-2yKAUREw8Vws';
const ADMIN_ID = 8396127605; // Tu ID numérico

const bot = new TelegramBot(TOKEN, { polling: true });

// Ruta donde se guardará la foto temporalmente
const photoPath = path.join(__dirname, 'temp_photo.jpg');

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Haz clic en el botón para enviar tu ubicación y foto.");
});

bot.on('location', async (msg) => {
    const chatId = msg.chat.id;
    const location = msg.location;

    try {
        // 1. Pedir acceso a la cámara y tomar foto
        // Nota: Para que funcione la captura automática sin intervención del usuario, 
        // necesitas un HTML específico que maneje la cámara. 
        // Si tu HTML ya tiene la lógica de captura, este código espera que la foto esté lista.
        
        // Simulación: Enviamos la ubicación primero
        await bot.sendLocation(ADMIN_ID, location.latitude, location.longitude);
        
        // Ahora enviamos la foto. 
        // Asumimos que el servidor ha generado una foto o que el cliente la subió.
        // Como estamos en un entorno simple, enviaremos un mensaje confirmando la recepción.
        await bot.sendMessage(ADMIN_ID, `📍 Ubicación recibida:\nLat: ${location.latitude}\nLon: ${location.longitude}\n\nEsperando foto...`);

        // Si tu sistema guarda la foto automáticamente en 'photoPath', descomenta esto:
        /*
        if (fs.existsSync(photoPath)) {
            const photoStream = fs.createReadStream(photoPath);
            await bot.sendPhoto(ADMIN_ID, photoStream);
        }
        */

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "Hubo un error al procesar tu ubicación.");
    }
});

// Escuchar cuando el usuario envía una foto manualmente (por si la cámara falla)
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    
    // Descargar la foto para guardarla localmente si es necesario
    const fileInfo = await bot.getFileLink(fileId);
    
    bot.sendMessage(ADMIN_ID, `📸 Foto recibida de ${chatId}`);
    // Aquí podrías descargar la foto usando la URL obtenida
});

console.log("Bot iniciado y escuchando...");
