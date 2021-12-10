const express = require("express")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


const app = express()
app.use(express.json())


const posts = [
  {
    username: 'Tom',
    title: "Post a Cat"
  },
  {
    username: 'Jerry',
    title: "Post a Mouse"
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user)
  res.json(posts.filter(post => post.username == req.user.name))
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader &&  authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(3000, () => {
  console.log("Server 3000 is Running")
})
