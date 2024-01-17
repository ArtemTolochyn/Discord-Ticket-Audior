const {EmbedBuilder} = require("discord.js");
const {messageFormatter} = require("../../utils/formatter");
const {embed} = require("./emdeb");

class UserHandler
{

    static join(client, event, config)
    {
        const role = event.guild.roles.cache.get(config["memberJoin"]["role"])

        event.roles.add(role)

        const title = messageFormatter(config["memberJoin"]["title"], event)
        const body = messageFormatter(config["memberJoin"]["body"], event)
        const footer = messageFormatter(config["memberJoin"]["footer"], event)

        client.channels
            .fetch(config["memberJoin"]["channel"])
            .then(channel=> channel.send({ embeds: [embed(title, body, footer, event)] }))
    }

    static leave(client, event, config)
    {

        const title = messageFormatter(config["memberLeave"]["title"], event)
        const body = messageFormatter(config["memberLeave"]["body"], event)
        const footer = messageFormatter(config["memberLeave"]["footer"], event)

        client.channels
            .fetch(config["memberLeave"]["channel"])
            .then(channel=> channel.send({ embeds: [embed(title, body, footer, event)] }))
    }
}

module.exports = {
    UserHandler,
};