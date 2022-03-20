const { SlashCommandBuilder } = require('@discordjs/builders')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { client_email, private_key } = require("../fluid-outcome.json")
const doc = new GoogleSpreadsheet('1Xxhws4Yo6VVDMYYrx-b1e9lWYzgax4dIDVApXi4v08g');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('strike').setDescription('Adds a strike to the specified username.')
        .addStringOption(option => option.setName('name').setRequired(true).setDescription('The name of the player to strike'))
    ,
    async execute(interaction, client) {
        const rowName = interaction.options.getString("name")
        await doc.useServiceAccountAuth({

            client_email,
            private_key,
        });

        await doc.loadInfo();
        let sheet = await doc.sheetsByIndex[0]
        const rows = await sheet.getRows();

        for (let i = 0; i < rows.length; i++) {
            let rowNameInLoop = rows[i]._rawData[0]

            if (rowNameInLoop.toLowerCase() === rowName.toLowerCase()) {

                let values = {
                    0: "First",
                    1: "Second",
                    2: "Third"
                }

                for (let j = 0; j < 3; j++) {
                    let call = values[j]
                    if (rows[i][call] === "TRUE") {
                        continue;
                    } else {
                        rows[i][call] = "TRUE"
                        break;
                    }
                }
                rows[i].save()

            }
        }

        await interaction.reply(`Updated contents of ${rowName} `)
    }
}