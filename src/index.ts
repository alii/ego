import {Client} from 'discord.js';
import {model, Schema, Document, connect} from "mongoose";
import "dotenv/config";

connect("mongodb://127.0.0.1:27017/ego", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("ego is connected to database, fuck you"));

const client = new Client();

interface IUser extends Document {
  discordId: string;
  ego: number;
}

const Model = model<IUser>("User", new Schema({
  discordId: String,
  ego: Number,
}))

client.on("message", async message => {
  const mentions = message.mentions.users.array();

  if (message.content.includes("ego") && !message.content.startsWith("%ego") && mentions.length > 0) {
    const user = await Model.findOne({
      discordId: mentions[0].id,
    });

    if (!user) {
      await new Model({
        discordId: mentions[0].id,
        ego: 1,
      }).save();

      return;
    }

    user.ego = user.ego + 1;
    await user.save();
  }

  if (message.content.startsWith("%ego")) {
    const user = await Model.findOne({
      discordId: mentions[0].id,
    });

    if (!user) {
      return message.reply("doesnt exist you egotistical fuck");
    }

    message.channel.send(`<@${user.discordId}>'s total ego size: ${user.ego}ft`);
  }
});

client.login().then(() => console.log("ego logged in"));