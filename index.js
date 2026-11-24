const { Telegraf } = require('telegraf');
const http = require('http');

// TU TOKEN DE TELEGRAM
const BOT_TOKEN = '9087778104:AAEwlyzptGIwaArDnCdQcP-2yKAUREw8Vws'; 
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('¡Hola! Usa /photo para enviarme una foto.'));

bot.command('photo', async (ctx) => {
    try {
        // Aquí iría tu lógica para obtener la foto y ubicación
        const link = "https://tu-pagina-web.com/captura"; 
        await ctx.reply(`📸 ¡Foto capturada! <a href="${link}">Ver aquí</a>`, { parse_mode: 'HTML' });
    } catch (e) {
        ctx.reply('Hubo un error.');
    }
});

bot.launch();
console.log("Bot de Telegram activo...");

// --- PARTE NUEVA PARA RENDER ---
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Servicio Activo');
});

server.listen(PORT, () => {
    console.log(`Servidor Web escuchando en el puerto ${PORT}`);
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
