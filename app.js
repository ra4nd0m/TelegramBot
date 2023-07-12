const { Telegraf } = require('telegraf');
const http = require('http');
require('dotenv').config();

//bot functions
const bot = new Telegraf(process.env.TOKEN);
var chat_id;
bot.start((ctx) => { ctx.reply('Welcome ' + ctx.from.id); chat_id = ctx.from.id });
bot.command('hello', (ctx) => ctx.reply('Hello'));
bot.launch();


//setup and start server
const server = http.createServer(async (req, res) => {
    console.log(req.method);
    if (req.method == 'POST') {
        const buffers = [];
        //parse recived data
        for await (const chunck of req) {
            buffers.push(chunck);
        }
        const data = JSON.parse(Buffer.concat(buffers).toString());
        //send data to chat
        bot.telegram.sendMessage(chat_id, data[1].title + "\n" + data[1].content + "\n" + data[0].link);
    };
    res.writeHead(200);
    res.end('Recived');
});
server.listen(process.env.PORT, () => console.log("server is running on port: ", process.env.PORT));

//logout
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));