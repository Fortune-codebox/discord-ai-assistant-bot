// We will need to 'require' some packages to use for this file
const dotenv = require('dotenv');
const {getQuote, callPredict} = require('./utils')
dotenv.config();
require('./commands.js')

const { Client, GatewayIntentBits, Partials } = require('discord.js');

// Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, 4096], partials: [Partials.Channel] });



// When the client is ready, run this code once
client.once('ready', () => {
  console.log('Ready!');
});
// Login to Discord with your bot's token
client.login(process.env.DISCORD_TOKEN);

const prefix = ""
let previousAns = ""
// Whenever the client sees a new message in the chat, run the following code
client.on('messageCreate', async msg => {

    if (msg.content === previousAns) return

    const response =  await callPredict(msg.content)
    if(response === null) return
    previousAns = response
    msg.channel.send(response);



    // if (msg.content.includes("inspire")) {
    //   getQuote().then(quote => msg.channel.send(quote))
    // }
});



process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
  console.log(error)
});