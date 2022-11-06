const { Client, Discord, MessageEmbed } = require("discord.js");
const config = require('./config.json')
const client = new Client({
  disableEveryone: true
});
require('./server.js');

client.on('ready', () => {
    console.log(`${client.user.tag} is online!`)
})

let count = 0
let answer = []

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

client.on('message', async message => {

    let args = message.content.slice(config.prefix.length).trim().split(/ +/)
    let command = args.shift().toLowerCase()


    let questions = [
        { question: "Are you familiar with Github ?  ``Yes/No``" },
        { question: "How long are you online a day ?" },
        { question: "When you get stuck on a problem, what do you do ?" },
        { question: "How old are you ?" },
        { question: "Are you ready to work in a team and move it forward in a meaningful way ?  ``Yes/No``" },
    ]


    if (!message.content.startsWith(config.prefix) || message.author.bot) return
    if (command === "apply") {
        for (let i = 0; i < questions.length; i++) {
            const send = await message.author.send(questions[i].question)
            const filter1 = m => m.author.id === message.author.id
            const res = await send.channel.awaitMessages(filter1, { time: 5 * 60000, max: 1 })
            const msg = await res.first().content
            if (msg !== undefined || null) count++
            answer.push(msg)
            if (count == questions.length) {
                message.author.send("Subbmitted application! ``Made by RainyXeon``")
                const embed = new MessageEmbed()
                    .setTitle('Application Submitted')
                    .setDescription(`This application was submitted by ${message.author.tag} (${message.author.id}).\nCreated: ${message.author.createdAt}`)
                for (let i = 0; i < questions.length; i++) embed.addField(questions[i].question, `Answer: \`${answer[i]}\``)
                message.client.channels.cache.get(config.applicationChannel).send(embed)
            }
        }
    } 

    if(command === "decline"){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("you dont' have permission to use this command")
        let User = message.mentions.users.first()
        if(!User) return message.channel.send("Please provide a user for me to decline")
        User.send("Your application to " + message.guild.name + " got declined by: " + message.author.tag)
    }

    if(command === "accept"){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("you dont' have permission to use this command")
        let User = message.mentions.users.first()
        if(!User) return message.channel.send("Please provide a user for me to accept")
        User.send(":tada: Your application to " + message.guild.name + " got accepted by: " + message.author.tag)
    }
})

client.login(config.token || process.env.TOKEN)
