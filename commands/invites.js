const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dmall")
        .setDescription("Envia uma mensagem privada para todos os membros.")
        .addStringOption(option =>
            option
                .setName("mensagem")
                .setDescription("Mensagem que será enviada.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const mensagem = interaction.options.getString("mensagem");

        await interaction.reply({
            content: "📨 Enviando mensagens...",
            ephemeral: true
        });

        const membros = await interaction.guild.members.fetch();

        let enviados = 0;
        let falhas = 0;

        for (const [, membro] of membros) {

            if (membro.user.bot) continue;

            try {
                await membro.send(mensagem);
                enviados++;
            } catch {
                falhas++;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await interaction.followUp({
            content: `✅ Finalizado!\nEnviados: ${enviados}\nFalhas: ${falhas}`,
            ephemeral: true
        });
    }
};
