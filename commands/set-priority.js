const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-priority')
    .setDescription('Set the priority of the current ticket')
    .addStringOption(option =>
      option.setName('priority')
        .setDescription('The priority level')
        .setRequired(true)
        .addChoices(
          { name: 'Low', value: 'Low' },
          { name: 'Normal', value: 'Normal' },
          { name: 'High', value: 'High' },
          { name: 'Urgent', value: 'Urgent' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;
    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({
        content: 'This command can only be used in ticket channels.',
        ephemeral: true,
      });
    }

    const priority = interaction.options.getString('priority');
    const oldTopic = channel.topic || '';
    const [ticketOwner] = oldTopic.split('|');
    const newTopic = `${ticketOwner.trim()} | Priority: ${priority}`;

    await channel.setTopic(newTopic);

    const embed = new EmbedBuilder()
      .setTitle('Ticket Priority Updated')
      .setDescription(`This ticket's priority has been set to: ${priority}`)
      .setColor('#0099ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};