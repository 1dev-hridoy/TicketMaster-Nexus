const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer-ticket')
    .setDescription('Transfer the ticket to another user')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to transfer the ticket to')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;
    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({
        content: 'This command can only be used in ticket channels.',
        ephemeral: true,
      });
    }

    const newOwner = interaction.options.getUser('user');
    const oldTopic = channel.topic || '';
    const [, ...rest] = oldTopic.split('|');
    const newTopic = `${newOwner.tag} | ${rest.join('|')}`;

    await channel.setTopic(newTopic);
    await channel.permissionOverwrites.edit(newOwner, {
      ViewChannel: true,
      SendMessages: true,
    });

    const embed = new EmbedBuilder()
      .setTitle('Ticket Transferred')
      .setDescription(`This ticket has been transferred to ${newOwner.tag}`)
      .setColor('#0099ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};