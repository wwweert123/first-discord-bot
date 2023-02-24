const { request } = require("undici");

const { accountkey } = require("../config.json");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("causeway")
    .setDescription("picture of causeway")
    .addIntegerOption((option) =>
      option
        .setName("angle")
        .setDescription("Camera Angle at the Causeway")
        .setRequired(true)
        .addChoices(
          { name: "Angle 1", value: 2701 },
          { name: "Angle 2", value: 2702 }
        )
    ),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    await interaction.deferReply();
    const causewayResult = await request(
      "http://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2",
      {
        headers: { AccountKey: accountkey },
      }
    );
    let url = "";
    const { value } = await causewayResult.body.json();
    for (let i = 0; i < value.length; i++) {
      if (value[i].CameraID == interaction.options.getInteger("angle")) {
        url = value[i].ImageLink;
      }
    }
    console.log(url);
    interaction.editReply({ files: [url] });
  },
};
