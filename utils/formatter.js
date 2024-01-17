function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}.${formattedMonth}.${year}`;
}
function messageFormatter(msg, event)
{
    return msg.replace("{username}", event)
        .replace("{userid}", event.id)
        .replace("{server}", event.guild.name)
        .replace("{date}", formatTimestamp(event.user.createdAt))
        .replace("{count}", event.guild.memberCount)
}

module.exports = {
    messageFormatter,
}