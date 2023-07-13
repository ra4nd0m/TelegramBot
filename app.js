const { Telegraf } = require('telegraf');
const http = require('http');
require('dotenv').config();

//bot functions
const bot = new Telegraf(process.env.TOKEN);
var chat_id;
bot.start((ctx) => { ctx.reply('Welcome ' + ctx.from.id); chat_id = ctx.from.id });
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
        for (const bit of data){
            bot.telegram.sendMessage(chat_id, bit.title + "\n" + bit.content + "\n" + bit.link).catch(err=>console.error(err));
        }
        
    };
    res.writeHead(200);
    res.end('Recived');
});
server.listen(process.env.PORT, () => console.log("server is running on port: ", process.env.PORT));

//logout
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
