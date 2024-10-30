const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list-tickets')
    .setDescription('List all open tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    const guild = interaction.guild;
    
    const ticketsCategory = guild.channels.cache.find(
      c => c.name === config.ticketCategory && c.type === ChannelType.GuildCategory
    );

    if (!ticketsCategory) {
      return interaction.reply({ content: 'No tickets found.', ephemeral: true });
    }

    const tickets = ticketsCategory.children.cache.filter(c => c.type === ChannelType.GuildText && c.name !== 'ticket-creation');
    
    const ticketList = tickets.map(ticket => {
      const ticketOwner = ticket.topic ? ticket.topic.split('|')[0].trim() : 'Unknown';
      const ticketPriority = ticket.topic ? ticket.topic.split('|')[1].trim() : 'Normal';
      return `${ticket.name} - Owner: ${ticketOwner} | Priority: ${ticketPriority}`;
    }).join('\n') || 'No open tickets.';

    const embed = new EmbedBuilder()
      .setTitle('Open Tickets')
      .setDescription(ticketList)
      .setColor('#0099ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};