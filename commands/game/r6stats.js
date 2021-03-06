const { RichEmbed } = require("discord.js");
const { rainbow: {email , password } } = require("../../auth.json");
const { stripIndents } = require("common-tags");
const R6API = require("r6api.js");
const { getId, getLevel, getRank, getStats } = new R6API(email, password);


module.exports = {
    name: "r6stats",
    category: "game",
    description: "Displays your rainbow six siege stats for specified player",
    usage: "<user> (platform)",
    aliases: ["rainbow", "rainbow6"],
    run: async (client, message, args) => {
        const platforms = { pc: "UPLAY", xbox: "XBL", ps4: "PSN" };
        const regions = { eu: "emea", na: "ncsa", as: "apac" };
        
        let player, platform, region;

        if(!args[0]) return message.reply("please specify a player to be searched!");
        else player = args[0];

        args[1] && [ "pc", "xbox", "ps4" ].includes(args[1].toLowerCase()) ? platform = platforms[args[1].toLowerCase()] : platform = platforms["pc"];
        args[2] && [ "eu", "na", "as" ].includes(args[2].toLowerCase()) ? region = regions[args[1].toLowerCase()] : region = regions["eu"];
        
        if(platform === "XBL") player.replace("_", " ");

        player = await getId(platform,player);
        if(!player.length) return message.reply("Couldn't find/fetch results for that player");
        player = player[0];

        const playerRank = await getRank(platform,player.id);
        const playerStats = await getStats(platform,player.id);
        const playerGame = await getLevel(platform,player.id);

        if (!playerRank.length || !playerStats.length || !playerGame.length) return message.channel.send("I was unable to fetch some data. Try again!");

        const { current, max, lastMatch } = playerRank[0].seasons[Object.keys(playerRank[0].seasons)[0]].regions[ region ];
        const { pvp, pve } = playerStats[0];
        const { level , xp } = playerGame[0];

        platform = Object.keys(platforms).find((key) => platforms[key] === platform).toUpperCase();
        region = Object.keys(regions).find((key) => regions[key] === region).toUpperCase();

        const embed = new RichEmbed()
            .setColor("Random")
            .setAuthor(player.username, client.user.displayAvatarURL)
            .setDescription(`Stats for the **${region}** region on ${platform}.`)
            .setThumbnail(current.image)
            .addField("General:", stripIndents`
                **Level:** ${level} (${xp} xp)
                **Rank** ${current.name} (Max: ${max.name})
                **MMR:** ${current.mmr}    
            `)
            .addField("Statistics:", stripIndents`
                **Wins:** ${pvp.general.wins}
                **Losses:** ${pvp.general.losses}
                **Win/Loss Ratio:** ${(pvp.general.wins / pvp.general.losses * 100).toFixed(2)}%
                **Kills:** ${pvp.general.kills}
                **Deaths:** ${pvp.general.deaths}
                **Kills/Deaths Ratio:** ${(pvp.general.kills / pvp.general.deaths).toFixed(2)}
                **Playtime:** ${Math.round(pvp.general.playtime / 3600)} hours
            `)
            .addField("Terrorist Hunt:", stripIndents`
                **Wins:** ${pve.general.wins}
                **Losses:** ${pve.general.losses}
                **Win/Loss Ratio:** ${(pve.general.wins / pve.general.losses * 100).toFixed(2)}%
                **Kills:** ${pve.general.kills}
                **Deaths:** ${pve.general.deaths}
                **Kills/Deaths Ratio:** ${(pve.general.kills / pve.general.deaths).toFixed(2)}
                **Playtime:** ${Math.round(pve.general.playtime / 3600)} hours
            `)
            .setTimestamp()
            .setFooter(client.user.username);

        message.channel.send(embed).catch((e) => message.channel.send(`There was error ${e.message}`));
    }
    
}
