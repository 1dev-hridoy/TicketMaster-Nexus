const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-stats')
    .setDescription('View ticket statistics')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    const guild = interaction.guild;
    
    const ticketsCategory = guild.channels.cache.find(
      c => c.name === config.ticketCategory && c.type === ChannelType.GuildCategory
    );

    if (!ticketsCategory) {
      return interaction.reply({ content: 'No tickets category found.', ephemeral: true });
    }

    const openTickets = ticketsCategory.children.cache.filter(c => c.type === ChannelType.GuildText && c.name !== 'ticket-creation');
    
    const archiveDir = path.join(__dirname, '..', 'archives');
    const archivedTickets = await fs.readdir(archiveDir).catch(() => []);

    const embed = new EmbedBuilder()
      .setTitle('Ticket Statistics')
      .addFields(
        { name: 'Open Tickets', value: openTickets.size.toString(), inline: true },
        { name: 'Closed Tickets', value: archivedTickets.length.toString(), inline: true },
        { name: 'Total Tickets', value: (openTickets.size + archivedTickets.length).toString(), inline: true }
      )
      .setColor('#0099ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};