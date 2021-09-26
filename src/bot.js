// Author: Berdason Badel

require("dotenv").config();

const fs = require('fs');
var path = require("path")
var file = fs.readFileSync(path.resolve(__dirname, "./score.json"))


const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] }); // creating an instance of the above class
client.login(process.env.DISCORDJS_BOT_TOKEN);
const PREFIX = "!";

const trivia = require("./questions"); // locating in src 
var score = JSON.parse(file)


client.on('ready', () => {
    console.log('Login Successful');
})

// Welcome
client.on('messageCreate', (message) => { // call back
    if (message.author.bot) {
        if(message.author.id === client.user.id) {
            selfDestruct(message)
        }
        return;
    } // ignores bot messages
    console.log(`[${message.author.tag}]: ${message.content}`);
    if (message.content === 'hello') {
        message.reply('sup bitch');
    }

    if (message.content === PREFIX + 'trivia') {
        message.reply('Select a Category: \nhistory \nassyriantrivia')
    }

    if (message.content === PREFIX +'trivia history') {
        let rand = getRandomInt(trivia.history.length - 1);
        let solution = trivia.history[rand].solution;
        let answers = trivia.history[rand].answers;
        let response = "";

        for (let i = 0; i < answers.length; i++) {
            response += solutionToEmoji(i) + " " + answers[i] + "\n"
        }
        message.reply("**"+trivia.history[rand].question+"**" + "\n" + response).then(function (message) {
            message.react("1️⃣")
            message.react("2️⃣")
            message.react("3️⃣")
            message.react("4️⃣")

            const filter = (reaction, user) => {
                return reaction.emoji.name === '1️⃣' && user.id != message.author.id
                    || reaction.emoji.name === '2️⃣' && user.id != message.author.id
                    || reaction.emoji.name === '3️⃣' && user.id != message.author.id
                    || reaction.emoji.name === '4️⃣' && user.id != message.author.id;
            };

            message.awaitReactions({ filter, max: 20, time: 15000 })
                .then(collected => {
                    let ansReaction = collected.get(solutionToEmoji(trivia.history[rand].solution))
                    if(ansReaction != null) {
                        ansReaction.users.fetch().then(users => {
                            users.each(user => {
                                //console.log(user.id)
                                //console.log(score[user.id])
                                if(score[user.id] != null) {
                                    score[user.id] = score[user.id] + 5;
                                } else if (score[user.id] == null && user.id != "887021739505246208") {
                                    score[user.id] = 5
                                }
                                
                            })
                            fs.writeFileSync(path.resolve(__dirname, "./score.json"), JSON.stringify(score, null, 2), 'utf8')
                        })
                    }
                })
                
                .catch(e => {
                    console.log(e)
                });
        });

         setTimeout(() => {message.reply("Correct Answer: " + trivia.history[rand].answers[solution]);
         } , 15000);
    }

    if (message.content === PREFIX +'trivia assyriantrivia') {
        let rand = getRandomInt(trivia.assyriantrivia.length - 1);
        let solution = trivia.assyriantrivia[rand].solution;
        let answers = trivia.assyriantrivia[rand].answers;
        let response = "";

        for (let i = 0; i < answers.length; i++) {
            response += solutionToEmoji(i) + " " + answers[i] + "\n"
        }

        message.reply("**"+trivia.assyriantrivia[rand].question +"**" + "\n" + response).then(function (message) {
            message.react("1️⃣")
            message.react("2️⃣")
            message.react("3️⃣")
            message.react("4️⃣")

            const filter = (reaction, user) => {
                return reaction.emoji.name === '1️⃣' && user.id != message.author.id
                    || reaction.emoji.name === '2️⃣' && user.id != message.author.id
                    || reaction.emoji.name === '3️⃣' && user.id != message.author.id
                    || reaction.emoji.name === '4️⃣' && user.id != message.author.id;
            };

            message.awaitReactions({ filter, max: 20, time: 15000 })
                .then(collected => {
                    let ansReaction = collected.get(solutionToEmoji(trivia.assyriantrivia[rand].solution))
                    if(ansReaction != null) {
                        ansReaction.users.fetch().then(users => {
                            users.each(user => {
                                //console.log(user.id)
                                //console.log(score[user.id])
                                if(score[user.id] != null) {
                                    score[user.id] = score[user.id] + 5;
                                } else if (score[user.id] == null && user.id != "887021739505246208") {
                                    score[user.id] = 5
                                }
                                
                            })
                            fs.writeFileSync(path.resolve(__dirname, "./score.json"), JSON.stringify(score, null, 2), 'utf8')
                        })
                    }
                })
                
                .catch(e => {
                    console.log(e)
                });
        });

         setTimeout(() => {message.reply("Correct Answer: " + trivia.assyriantrivia[rand].answers[solution]);
         } , 15000);
    }

    if (message.content === PREFIX + 'clearall') {
        //message.channel.bulkDelete(100).catch(console.error);
        message.channel.send(`mark delete it`).then(sentMessage => {
            sentMessage.delete(5000);
        });
    }

    if(message.content === PREFIX + 'leaderboard') {
        leaderboard(client, message)
    }
});

async function leaderboardHelper(client) {
    let response = ""
    for (let x in score) {
        await client.users.fetch(x).then((User) => {
            response += User.username + ": "+ score[x] + "\n"
            //message.channel.send(User.username + ": "+ score[x])
                //console.log(x + ": "+ score[x])
            }).catch((err) => {
                console.log(err)
            })
     }
     return response
}

async function leaderboard(client, message) {
    leaderboardHelper(client).then((response)=> {
        message.channel.send(response)
    }) 
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function emojiToSolution(emoji) {
    if(emoji === "1️⃣") {
        return 0;
    }
    else if(emoji === "2️⃣") {
        return 1;
    }
    else if(emoji === "3️⃣") {
        return 2;
    }
    else if(emoji === "4️⃣") {
        return 3;
    }
    return -1;
}

function solutionToEmoji(solution) {
    if(solution == 0) {
        return "1️⃣";
    }
    else if(solution == 1) {
        return "2️⃣";
    }
    else if(solution == 2) {
        return "3️⃣";
    }
    else if(solution == 3) {
        return "4️⃣";
    }
    return -1;
}

async function selfDestruct(message){
    setTimeout(() => {
        message.delete()
         } , 40000);
}
