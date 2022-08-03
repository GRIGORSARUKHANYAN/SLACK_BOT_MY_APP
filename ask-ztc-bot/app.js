const {slackivevnt} = require("@slack/events-api")
const { App, LogLevel } = require("@slack/bolt");
const fs = require("fs")
const path = require("path")
require("dotenv").config();
const { log } = require("console");
const Bot = require("./model/Bot");
let usersStore = {};
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.APP_TOKEN
});
const bodyParser = require('body-parser');
app.command("/massage", async ({req,res, command, ack, say }) => {
  try {    
    await ack()
      say("Yaaay! that command works!");
    let userInfo = await app.client.users.conversations()

    let objWorkspace = {}
    userInfo.channels.forEach(element => (objWorkspace[element.name] =element.id));
    let data = JSON.stringify(objWorkspace, null, 2);
    let text = command.text
    let workspace_text = text.split("/")
    let workspacesNameId = workspace_text[0]
    let workspace_name_id = workspacesNameId.split('>')
    workspace_name_id.pop()
    if (workspace_text.length==1) {
      return await Bot.writeMassage(app,objWorkspace.general , "separate the letter string with a / character")
    }
    if (workspace_name_id.length==0) {
      return await Bot.writeMassage(app,objWorkspace.general , "do not leave the channels field empty")
    }

    
    for (let i = 0; i < workspace_name_id.length; i++) {
      workspace_name_id[i] = workspace_name_id[i].trim().slice(2);
      workspace_name_id[i] = workspace_name_id[i].split("|")[0]
    
    }
    if (await Bot.checkWorkspace(workspace_name_id,data) == false) {
      await Bot.writeMassage(app,objWorkspace.general , "Specify the correct channel name where you have permission")
    }
    else{
      for (let i = 0; i < workspace_name_id.length; i++) {
        await Bot.writeMassage(app,workspace_name_id[i],workspace_text[1])
      }
    }

  Bot.writefile(data)
  } catch (error) {
  
  console.log("err")
  console.error(error);
}

});

(async () => {
  const port = 3000
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
