const {EmbedBuilder} = require("discord.js");
function embed(title, body, footer, event)
{
    return new EmbedBuilder()
        .setAuthor({name: title})
        .setColor("#000000")
        .setDescription(body)
        .setFooter({text: footer})
        .setThumbnail(
            event.displayAvatarURL(
                { size: 1024, dynamic: true }
            )
        );
}

module.exports = {
    embed,
};