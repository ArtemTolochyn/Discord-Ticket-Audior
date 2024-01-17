const {UserHandler} = require("./usersHandler/userHandler");
const {TicketHandler} = require("./ticketHandler/ticketHandler");

class EventHandler{

    static userHandler = UserHandler;
    static ticketHandler = TicketHandler;
    static listen(client, config) {
        client.on("ready", () => {
            console.log(`Logged in as ${client.user.tag}!`);
        });

        client.on("guildMemberAdd", (event) => {
            this.userHandler.join(client, event, config)
        });

        client.on("guildMemberRemove", (event) => {
            console.log(event)
            this.userHandler.leave(client, event, config)
        });

        client.on("messageCreate", (event) => {
            this.ticketHandler.createMsg(client, event, config)
        });

        client.on("interactionCreate", (event) => {
            this.ticketHandler.interact(client, event, config)
        });
    }
}

module.exports = {
    EventHandler,
};