const { request } = require("undici");

const { accountkey } = require("../config.json");

const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

class FieldClass {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.inline = true;
  }
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bustiming")
    .setDescription("bus timing at a bus stop")
    .addIntegerOption((option) =>
      option
        .setName("buscode")
        .setDescription("bus code of the bus stop you want to query")
        .setRequired(true)
    ),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    await interaction.deferReply();
    const BusStopCode = interaction.options.getInteger("buscode");
    const query = new URLSearchParams({ BusStopCode });
    const allbusstops = await request(
      `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?${query}`,
      {
        headers: { AccountKey: accountkey },
      }
    );
    const { Services } = await allbusstops.body.json();
    // console.log(Services);
    const embed = new EmbedBuilder()
      .setColor(0xefff00)
      .setTitle(`Bus Stop ${BusStopCode}`);
    let fieldarray = [];
    for (let i = 0; i < Services.length; i++) {
      fieldarray.push(new FieldClass(Services[i].ServiceNo, ""));
      for (let j = 1; j <= 3; j++) {
        let bus = "NextBus";
        if (j != 1) {
          bus += j.toString();
        }
        let time = "";
        if (Services[i][bus].EstimatedArrival != "") {
          const arrivaldatetime = Date.parse(Services[i][bus].EstimatedArrival);
          // time = arrivaldatetime.split('T')[1].trim();
          // time = time.split('+')[0].trim();
          if (Date.now() > arrivaldatetime) {
            time = "Zao liao";
          } else {
            time =
              millisToMinutesAndSeconds(arrivaldatetime - Date.now()) + " mins";
            // console.log(arrivaldatetime - Date.now());
          }
        }

        // answer += time +" ";
        fieldarray[i].value += time + "\n";
      }
    }
    embed
      .addFields(fieldarray)
      .setThumbnail(
        `https://static.mothership.sg/1/2019/05/Screenshot-2019-05-23-at-12.04.27-PM.png`
      );
    interaction.editReply({ embeds: [embed] });
  },
};
