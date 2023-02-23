const { request } = require("undici");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cate")
    .setDescription("Sends a picture of a cate"),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    await interaction.deferReply();
    const catResult = await request("https://aws.random.cat/meow");
    const { file } = await catResult.body.json();
    console.log(file);
    interaction.editReply({ files: [file] });
  },
};
