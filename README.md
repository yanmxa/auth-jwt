# AUTHENTICATION 

## Install Package
```
  "bcryptjs": "^2.4.3",
  "dotenv": "^10.0.0",
  "express": "^4.17.1",
  "joi": "^17.4.2",
  "jsonwebtoken": "^8.5.1",
  "mongoose": "^6.0.13"
```

## Register
- Save User with Encoded Password
  ```js
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  ```

## Login in
- Find the User and Compare the Password
  ```js
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email is not found')
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')
  ```
- Create and Assign a Token
  ```js
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
  ```

## Middleware to Handle the Routes
- Create Verification (verifyToken.js)
  ```js
  module.exports = function auth (req, res, next) {
    const token = req.header('auth-token')
    if (!token) return res.status(401).send('Access Denied')
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = verified
      next()
    } catch (err) {
      res.status(400).send('Invalid Token')
    }
  }
  ```
- Add to Routes
  ```js
  const verify = require('./verifyToken')
  router.get('/', verify, (req, res) => {
    console.log(req.user)
    res.json({ 
      posts: {
        title: 'my first post',
        desc: 'random data you should access'
      }
    })
  })
  ```

