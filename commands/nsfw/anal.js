
const { get } = require("snekfetch");



module.exports = {
  name: "anal",
  description: "This command will return porn in gif form.",
  category: "NSFW",
  usage: "anal",
  cost: 40,
  cooldown: 10,
  loadingString: "<a:typing:397490442469376001> **{{displayName}}** is looking for porn gifs...",
  aliases: ["bumfun"],
  run: async (client,message, args, level, loadingMessage) => {
      //console.log(message.channel.nsfw  +' is ');
      if (!message.channel.nsfw) return message.reply("🔞 Cannot display NSFW content in a SFW channel.");
    const { body } = await get("https://nekobot.xyz/api/image?type=anal");
    await message.channel.send({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.message,
        "color": 6192321,
        "image": {
          "url": body.message
        },
        "footer": {
          "text": `Requested by ${message.author.tag} | Powered by NekoBot API`
        }
      }
    });
  }
  
}
