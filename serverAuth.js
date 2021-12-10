const express = require("express")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { ref } = require("joi")
dotenv.config()


const app = express()
app.use(express.json())

let refreshTokens = [] // we may save it in db or redis

app.post('/login', (req, res) => {
  // Authenticate User
  const username = req.body.username
  const user = {name: username}
  const token = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

  refreshTokens.push(refreshToken)

  res.json( { accessToken: token, refreshToken } )
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn:  '60s'})
}

app.post('/token', (req, res) => {

  const refreshToken = req.body.refreshToken

  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name})
    res.json({ accessToken }) 
  })

})


app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.listen(4000, () => {
  console.log("Server 4000 is Running")
})


// Authentication is implemented through JWT access tokens along with refresh tokens. 
// The API returns a short-lived token (JWT), which expires in 15 minutes, and in HTTP cookies, the refresh token expires in 7 days.
