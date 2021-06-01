require("dotenv").config()

const express = require("express");
const { sendEmail } = require("./Helpers/MailHelper")
const { makeToken } = require("./Helpers/TokenMaker")

const app = express();
app.use(express.json())

var allowed = [{token: "test", id: "none", authorized: false}]

app.get("/authenticate/student/:token", (req, res) => {
  if (allowed.filter(item => item.token === req.params.token).length > 0) {
    let tmp = []
    for (let item of allowed) {
      if (item.token === req.params.token) {
        tmp.push({
          token: item.token,
          id: item.id,
          authorized: true
        })
      } else {
        tmp.push(item)
      }
    }
    allowed = tmp;
    return res.status(200).send("<b>Successful Authentication</b>")
  } else {
    return res.status(404).send("<i>Unrecognized ID </i>")
  }
})

app.get("/authenticate/discord", (req, res) => {
  res.status(200).sendFile("./HTML-Pages/DiscordLogin.html", { root: '.' })
})

app.get("/authenticate/email", (req, res) => {
  res.status(200).sendFile("./HTML-Pages/EmailPage.html", { root: '.' })
})

app.post("/authenticate/details", async (req, res) => {
  try {
    console.log(req.body)
    let email = req.body.email;
    let discord_id = req.body.discord_id;
    let token = await makeToken()
    allowed.push({token: token, id: discord_id, authorized: false})
    sendEmail(email, token)
    res.status(200).send("success")
  } catch (err) {
    res.status(400).send({message: `Internal err: ${err}`})
  }
})

const PORT = 4000
app.listen(PORT, ()=> {
  console.log(`Listening on port ${PORT}`)
})

const Discord = require("discord.js");

const client = new Discord.Client();

client.once('ready', () => {
  console.log("Ready")
})

client.on('message', message => {
  if (message.content === "/verify-student") {
    if (allowed.filter(item => item.id === message.member.id).length > 0) {
      let user = message.member.user
      message.member.roles.add("849023486722834472")
      message.channel.send(`${user} University Of York Student Verified`)
    } else {
      let user = message.member.user;
      message.channel.send(`${user} you haven't verified your york email, please do so using this link: http://droplet.yordevs.com:4000/authenticate/discord`)
    }
  }
})

client.login(process.env.DISCORD_TOKEN)


