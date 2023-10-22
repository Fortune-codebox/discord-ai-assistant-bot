const { REST, Routes } = require('discord.js')


let commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');
  setTimeout(async() => {
    await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands });
  }, 100)

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}