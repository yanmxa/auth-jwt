const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../common/validation')

// REGISTER
router.post('/register', async (req, res) => {

  // Validation
  const { error } = registerValidation(req.body)
  if ( error ) return res.status(400).send(error.details[0].message)

  // Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email })
  if ( emailExist ) return res.status(400).send('Email already exists')

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
   
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })

  try {
    const savedUser = await user.save()
    res.send({user: user._id})
  } catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  
  // Validation
  const { error } = loginValidation(req.body)
  if ( error ) return res.status(400).send(error.details[0].message)

  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Email is not found')
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('Invalid password')

  // create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token)
})



module.exports = router