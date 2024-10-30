const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close and archive the current ticket channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({
        content: 'This command can only be used in ticket channels.',
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const messages = await channel.messages.fetch();
    const transcript = messages.reverse().map(m => `${m.author.tag} (${m.createdAt.toLocaleString()}): ${m.content}`).join('\n');

    const archiveDir = path.join(__dirname, '..', 'archives');
    await fs.mkdir(archiveDir, { recursive: true });
    const archiveFile = path.join(archiveDir, `${channel.name}-${Date.now()}.txt`);
    await fs.writeFile(archiveFile, transcript);

    const embed = new EmbedBuilder()
      .setTitle('Ticket Closed')
      .setDescription(`Ticket ${channel.name} has been closed and archived.`)
      .setColor('#00ff00')
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    setTimeout(async () => {
      try {
        await channel.delete();
      } catch (error) {
        console.error(`Failed to delete channel: ${error}`);
      }
    }, 5000);
  },
};