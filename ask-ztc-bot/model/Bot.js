const fs = require("fs")
const path =require("path")
class Bot {    
    static async writeMassage(app,channelId,massage ) {
        const result = await app.client.chat.postMessage({
            channel: channelId,
            text: massage
        }); 
    }
    static checkWorkspace(workspace_name_id,data ) {
        let bul 
        data = JSON.parse(data)
        let arrData = Object.values(data)
        for (let i = 0; i < workspace_name_id.length; i++) {
            if (arrData.indexOf(workspace_name_id[i]) !== -1) {
                bul = true
                }else
                    {
                    bul = false
                    return bul 
          }
          return bul
        }
      }
    

    
    static   writefile(data) {
        fs.writeFile(path.join(__dirname,`../db/workspace.json`), data, (err) => {
        if (err) throw err;})
    }
}
module.exports = Bot;