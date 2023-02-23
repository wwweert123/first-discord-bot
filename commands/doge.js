const { request } = require("undici");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("doge")
    .setDescription("Sends a picture of a doge"),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    await interaction.deferReply();
    const dogeResult = await request("https://dog.ceo/api/breeds/image/random");
    const { message } = await dogeResult.body.json();
    console.log(message);
    interaction.editReply({ files: [message] });
  },
};
