const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs')
const { token } = require('./config.json')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(e => e.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command)
}

client.on('ready', () => {
    console.log(`${client.user.username} is online!`)
})
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token)

module.exports = {client}