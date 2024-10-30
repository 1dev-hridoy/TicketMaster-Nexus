const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('manage-support-roles')
    .setDescription('Add or remove support roles')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a support role')
        .addRoleOption(option => option.setName('role').setDescription('The role to add').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a support role')
        .addRoleOption(option => option.setName('role').setDescription('The role to remove').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const role = interaction.options.getRole('role');

    const configPath = path.join(__dirname, '..', 'config.json');
    const config = require(configPath);

    if (!config.supportRoles) {
      config.supportRoles = [];
    }

    if (subcommand === 'add') {
      if (config.supportRoles.includes(role.id)) {
        return interaction.reply({ content: 'This role is already a support role.', ephemeral: true });
      }
      config.supportRoles.push(role.id);
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      return interaction.reply({ content: `Added ${role.name} as a support role.`, ephemeral: true });
    } else if (subcommand === 'remove') {
      const index = config.supportRoles.indexOf(role.id);
      if (index === -1) {
        return interaction.reply({ content: 'This role is not a support role.', ephemeral: true });
      }
      config.supportRoles.splice(index, 1);
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      return interaction.reply({ content: `Removed ${role.name} from support roles.`, ephemeral: true });
    }
  },
};