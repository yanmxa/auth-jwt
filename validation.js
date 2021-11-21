// Validation
const Joi = require('joi')

// Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().min(6),
    password: Joi.string().required().min(3)
  })

  // LETS VALIDATE THE DATE BEFORE WE A USER
  return schema.validate(data)
}


// Login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().min(6),
    password: Joi.string().required().min(3)
  })

  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
