const { Telegraf } = require('telegraf');

// Tu Token proporcionado
const BOT_TOKEN = '9087778104:AAEwlyzptGIwaArDnCdQcP-2yKAUREw8Vws';
const bot = new Telegraf(BOT_TOKEN);

// Comando /start
bot.start((ctx) => {
    const welcomeMessage = `👋 ¡Hola! Soy tu Asistente Automático.\n\n` +
        `He recibido tu solicitud. Para usar el sistema de fotos:\n\n` +
        `1. Abre este enlace: [Tu Enlace Web Aquí] 🔗\n` +
        `2. Permite el acceso a la cámara y ubicación.\n` +
        `3. La foto se enviará automáticamente aquí.`;
    
    ctx.reply(welcomeMessage, {
        parse_mode: 'HTML'
    });
});

// Comando /help
bot.help((ctx) => {
    ctx.reply('📸 *Comandos disponibles:*\n' +
              '/start - Inicia el proceso\n' +
              '/help - Muestra esta ayuda\n' +
              '/stop - Cancela la sesión actual\n' +
              '/info - Datos técnicos', 
        { parse_mode: 'Markdown' });
});

// Comando /stop
bot.command('stop', (ctx) => {
    ctx.reply('⏹️ Sistema detenido. Esperando nuevas instrucciones...');
});

// Comando /info
bot.command('info', (ctx) => {
    ctx.reply(`🤖 *Estado del Bot:* Activo\n` +
              `🔑 Token: ${BOT_TOKEN.substring(0, 10)}...\n` +
              `📅 Hora del servidor: ${new Date().toISOString()}`);
});

// Manejo de errores básico
bot.catch((err) => {
    console.error('Error del bot:', err);
});

console.log('Bot iniciado correctamente...');
bot.launch();

// Limpieza graceful
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
