
const router = require('express').Router()
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

module.exports = router;