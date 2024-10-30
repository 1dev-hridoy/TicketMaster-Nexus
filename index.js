const { Client, GatewayIntentBits, Collection, ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await registerCommands(client);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  } else if (interaction.isButton()) {
    if (interaction.customId === 'create_ticket') {
      await handleCreateTicket(interaction);
    }
  }
});

async function registerCommands(client) {
  const commands = [];
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  try {
    console.log('Started refreshing application (/) commands.');
    await client.application.commands.set(commands);
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

async function handleCreateTicket(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const category = interaction.guild.channels.cache.find(c => c.name === config.ticketCategory && c.type === ChannelType.GuildCategory);

  if (!category) {
    return interaction.editReply({ content: 'Ticket category not found. Please contact an admin to set it up.' });
  }

  const existingChannel = interaction.guild.channels.cache.find(channel => 
    channel.name === `ticket-${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`
  );
  
  if (existingChannel) {
    return interaction.editReply({ content: 'You already have an open ticket!' });
  }

  const ticketChannel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`,
    type: ChannelType.GuildText,
    parent: category.id,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
      { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
    ]
  });

  const welcomeEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('New Support Ticket')
    .setDescription(`Hello ${interaction.user}, our support team will be with you shortly.`)
    .addFields(
      { name: 'Ticket ID', value: ticketChannel.id },
      { name: 'Created by', value: interaction.user.tag },
      { name: 'Priority', value: 'Normal' }
    )
    .setTimestamp();

  await ticketChannel.send({ embeds: [welcomeEmbed] });
  await interaction.editReply({ content: `Your ticket has been created: ${ticketChannel}` });
}

client.login(config.token);

// Log any unhandled errors
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

console.log('Bot is starting...');