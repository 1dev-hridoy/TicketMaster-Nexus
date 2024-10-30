const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('new-ticket')
    .setDescription('Sets up the ticket creation message in the Tickets channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const guild = interaction.guild;

    let category = guild.channels.cache.find(c => c.name === config.ticketCategory && c.type === ChannelType.GuildCategory);
    
    if (!category) {
      category = await guild.channels.create({
        name: config.ticketCategory,
        type: ChannelType.GuildCategory
      });
    }

    let ticketChannel = category.children.cache.find(c => c.name === 'ticket-creation' && c.type === ChannelType.GuildText);
    if (!ticketChannel) {
      ticketChannel = await guild.channels.create({
        name: 'ticket-creation',
        type: ChannelType.GuildText,
        parent: category.id,
        topic: 'Create a new support ticket here'
      });
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('Create Ticket')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎫')
      );

    await ticketChannel.send({ 
      content: '**Need help? Create a ticket!**\nClick the button below to open a new support ticket.',
      components: [row] 
    });
    await interaction.reply({ content: 'Ticket creation message has been sent to the ticket channel.', ephemeral: true });
  }
};