const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Start the luck game.")
        .addIntegerOption(option => option.setName("difficulty").setDescription("Set in 1 ~ 10 difficulty.").setRequired(true)),
    async execute(interaction) {
        // Get options
        const count = interaction.options.getInteger("difficulty");

        // Check 1 ~ 10 value.
        if (0 >= count) {
            await interaction.reply(`<@${interaction.user.id}> A number less than 0 cannot be entered. (0보다 작은 숫자는 입력할 수 없습니다.)`);

            return;
        } else if (count > 10) {
            await interaction.reply(`<@${interaction.user.id}> You cannot enter a number greater than 10. (10보다 큰 숫자는 입력할 수 없습니다.)`);

            return;
        }
    }
};