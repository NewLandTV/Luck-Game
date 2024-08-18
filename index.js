// Require
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { token } = require("./config.json");
const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

diffculty = 3;

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.data.name, command);
}

async function DrawGameBoard(interaction, value) {
    result = "";

    if (value === Math.floor(Math.random() * (diffculty + 1))) {
        result = "Luck!";
    } else {
        result = "Failed!";
    }

    // Game board
    const gameEmbed = new EmbedBuilder()
        .setColor(0x20880f)
        .setTitle("Luck Game Result")
        .setDescription(result);

    // Controls (L or R buttons)
    const rowButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("← [L]")
                .setStyle("Secondary")
                .setCustomId("L"),
            new ButtonBuilder()
                .setLabel("[R] →")
                .setStyle("Secondary")
                .setCustomId("R")
    );

    interaction.channel.bulkDelete(1);

    await interaction.reply({ embeds: [gameEmbed], components: [rowButtons] });
}

client.once("ready", () => {
    client.user.setActivity("Luck!", { type: "PLAYING" });

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async interaction => {
    // Button
    if (interaction.isButton()) {
        value = 0;

        if (interaction.customId === "L") {
            value = Math.floor(Math.random() * (diffculty + 1));
        } else if (interaction.customId === "R") {
            value = Math.floor(Math.random() * (diffculty + 1));
        }

        DrawGameBoard(interaction, value);

        return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        // Slash command execute
        await command.execute(interaction);

        DrawGameBoard(interaction, -1);
    } catch (error) {
        console.error(error);

        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        });
    }
});

client.login(token);