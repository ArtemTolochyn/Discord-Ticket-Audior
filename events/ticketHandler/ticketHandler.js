const {findValue} = require("./findValue");
const {ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require("discord.js");

class TicketHandler
{
    static async createMsg(client, event, config) {
        if (event.content === '/tickets' && !findValue(config['ticketConfig']['adminUsers'].split(","), event.author.id)) {

            event.delete();

            let stringBuilder = new StringSelectMenuBuilder()
                .setCustomId('ticket')
                .setPlaceholder(config['ticketConfig']['startMessage']['placeholder']);


            for (const item in config['ticketConfig']['startMessage']['Items']) {
                stringBuilder.addOptions({
                    label: config['ticketConfig']['startMessage']['Items'][item]['label'],
                    description: config['ticketConfig']['startMessage']['Items'][item]['description'],
                    value: item,
                });
            }

            const row = new ActionRowBuilder().addComponents(stringBuilder);

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ticket-faq')
                        .setLabel('FAQ')
                        .setStyle(2)
                );

            const embed = {
                color: Number(config['ticketConfig']['startMessage']['color']),
                title: config['ticketConfig']['startMessage']['title'],
                description: config['ticketConfig']['startMessage']['body'],
                image: config['ticketConfig']['startMessage']['image'],
                footer: config['ticketConfig']['startMessage']['footer']
            };


            client.channels.cache.get(config["ticketConfig"]["startMessage"]["channel"])
                .send({
                    embeds: [embed],
                    components: [row, button]
                })
        }

        if (event.content === '/close' || event.content === '/c') {
            event.delete();

            const moderators = config['ticketConfig']['moderators'].split(",");
            const all = await event.guild.members.fetch();

            for(let i = 0; i < moderators.length; i++) {
                all.forEach((member) => {
                    if(member.roles.cache.has(moderators[i]) && member.id.toString() === event.author.id) {
                        event.channel.leave();
                        event.channel.setLocked(true);

                        client.channels.cache.get(event.channel.id).send(config['ticketConfig']['ticketMessage']['ticketClosed']);

                        setTimeout(() => event.channel.delete(), 10000);
                    }
                });
            }
        }

        if (event.content === '/take' || event.content === '/t') {
            event.delete();

            const moderators = config['ticketConfig']['moderators'].split(",");
            const all = await event.guild.members.fetch();

            for(let i = 0; i < moderators.length; i++) {
                all.forEach((member) => {
                    if(member.roles.cache.has(moderators[i]) && member.id.toString() === event.author.id) {
                        client.channels.cache.get(
                            event.channel.id).send(config['ticketConfig']['ticketMessage']['take']
                            .replace("{user}", event.author.username)
                        );
                    }
                });
            }
        }

        if (event.content === '/drop' || event.content === '/d') {
            event.delete();

            const moderators = config['ticketConfig']['moderators'].split(",");
            const all = await event.guild.members.fetch();

            for(let i = 0; i < moderators.length; i++) {
                all.forEach((member) => {
                    if(member.roles.cache.has(moderators[i]) && member.id.toString() === event.author.id) {
                        client.channels.cache.get(
                            event.channel.id).send(config['ticketConfig']['ticketMessage']['drop']
                            .replace("{user}", event.author.username)
                        );
                    }
                });
            }
        }
    }

    static async interact(client, event, config) {
        if (event.isButton() && event.customId === 'ticket-faq') {
            let embed = {
                color: Number(config['ticketConfig']['startMessage']['FAQ']['color']),
                title: config['ticketConfig']['startMessage']['FAQ']['title'],
                description: config['ticketConfig']['startMessage']['FAQ']['description'],
                url: config['ticketConfig']['startMessage']['FAQ']['url'],
                author: config['ticketConfig']['startMessage']['FAQ']['author'],
                fields: config['ticketConfig']['startMessage']['FAQ']['fields'],
                thumbnail: config['ticketConfig']['startMessage']['FAQ']['thumbnail'],
                image: config['ticketConfig']['startMessage']['FAQ']['image'],
                footer: config['ticketConfig']['startMessage']['FAQ']['footer']
            };

            event.reply({embeds: [embed], ephemeral: true})
        }

        if(event.customId === 'ticket-close') {
            event.channel.leave();
            await event.channel.setLocked(true);
            event.reply({ content: config['ticketConfig']['ticketMessage']['ticketClosed'], ephemeral: true }).then(msg => {
                setTimeout(() => event.deleteReply(), 5000);
            });

            setTimeout(() => event.channel.delete(), 10000);
        }

        if (event.isStringSelectMenu()) {

            const menu = new ModalBuilder()
                .setCustomId('form-' + event.values)
                .setTitle(config['ticketConfig']['startMessage']['Items'][event.values]['label']);

            for (const field in config['ticketConfig']['startMessage']['Items'][event.values]['Form']) {
                let input = new TextInputBuilder()
                    .setCustomId(field)
                    .setLabel(config['ticketConfig']['startMessage']['Items'][event.values]['Form'][field]['label'])
                    .setPlaceholder(config['ticketConfig']['startMessage']['Items'][event.values]['Form'][field]['placeholder'])
                    .setStyle(config['ticketConfig']['startMessage']['Items'][event.values]['Form'][field]['style'] === "short" ? TextInputStyle.Short : TextInputStyle.Paragraph)
                    .setMinLength(config['ticketConfig']['startMessage']['Items'][event.values]['Form'][field]['min_length'])
                    .setMaxLength(config['ticketConfig']['startMessage']['Items'][event.values]['Form'][field]['max_length'])
                    .setRequired(config['ticketConfig']['startMessage']['Items'][event.values]['Form'][field]['required']);

                menu.addComponents(new ActionRowBuilder().addComponents(input));
            }

            event.showModal(menu);
        }

        if (event.isModalSubmit()) {

            let customId = event.customId.substring(5);

            let thread = await client.channels.cache.get(config['ticketConfig']['threadChannel'])
                .threads.create({
                    name: customId + '-' + event.user.username,
                    autoArchiveDuration: config['ticketConfig']['threadAutoArchive'],
                    type: 12
                });

            await thread.members.add(event.user);

            const moderators = config['ticketConfig']['moderators'].split(",");

            let all = await event.guild.members.fetch();



            for(let i = 0; i < moderators.length; i++) {
                all.forEach((member) => {
                    if(member.roles.cache.has(moderators[i]))
                        thread.members.add(member.user);
                });
            }

            let fields = [];
            for(const field in config['ticketConfig']['startMessage']['Items'][customId]['Form']) {
                let value = event.fields.getTextInputValue(field);
                fields.push({
                    name: config['ticketConfig']['startMessage']['Items'][customId]['Form'][field]['label'],
                    value: value.length === 0 ? '-':value,
                    inline: false
                });
            }

            let embed = {
                color: Number(config['ticketConfig']['ticketMessage']['color']),
                title: config['ticketConfig']['ticketMessage']['title']
                    .replace('{name}', config['ticketConfig']['startMessage']['Items'][customId]['label']),

                description: config['ticketConfig']['ticketMessage']['body']
                    .replace('{name}', config['ticketConfig']['startMessage']['Items'][customId]['label']),

                url: config['ticketConfig']['ticketMessage']['url'],
                thumbnail: config['ticketConfig']['ticketMessage']['thumbnail'],
                author: {
                    name: (event.user.discriminator !== '0' ? event.user.username + '#' + event.user.discriminator:event.user.username),
                    icon_url: (event.user.avatar != null ? 'https://cdn.discordapp.com/avatars/' + event.user.id + '/' + event.user.avatar + '.jpeg':config['Settings']['Ticket']['default_avatar'])
                },
                fields: fields,
            };

            let row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ticket-close')
                        .setLabel(config['ticketConfig']['ticketMessage']['closeTicket'])
                        .setStyle(4)
                );

            event.reply({ content: '<#' + thread.id + '>', ephemeral: true }).then(msg => {
                setTimeout(() => event.deleteReply(), 5000);
            });

            thread.send({ embeds: [embed], components: [row] }).then(msg => {
                msg.pin();
            });
        }
    }
}

module.exports = {
    TicketHandler,
}