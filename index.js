const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
const TOKEN = '9087778104:AAEwlyzptGIwaArDnCdQcP-2yKAUREw8Vws';
const ADMIN_ID = 8396127605; // Tu ID numérico

// Usamos polling simple para evitar conflictos de múltiples instancias
const bot = new TelegramBot(TOKEN, { 
    polling: true,
    firstPollIntervalMillis: 500, // Evita picos al inicio
    pollingRetryMillis: 5000      // Reintenta si hay error de conexión
});

bot.on('location', async (msg) => {
    const chatId = msg.chat.id;
    const location = msg.location;

    try {
        // Enviar ubicación al admin
        await bot.sendLocation(ADMIN_ID, location.latitude, location.longitude);
        
        // Confirmación al usuario
        await bot.sendMessage(chatId, "✅ Ubicación enviada correctamente.");
        
        // Log para depuración
        console.log(`Ubicación recibida de ${chatId}: ${location.latitude}, ${location.longitude}`);
        
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Hubo un error al enviar la ubicación.");
    }
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "👋 Hola. Por favor, comparte tu ubicación para ser capturado.");
});

console.log("Bot iniciado correctamente.");
