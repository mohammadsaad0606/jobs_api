const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async (req, res, next) => {
    try {
      const user = await User.create({ ...req.body });
      const token = user.createJWT()
      res.status(StatusCodes.CREATED).json({user:{name:user.name}, msg:'User created successfully' });
    } catch (error) {
      // Ensure you are sending the error message in the response
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

const login = async(req, res)=>{
    const {email, password} = req.body

  if(!email || !password){
    throw new BadRequestError('Please provide email and password')
  }
const user = await User.findOne({email})
if(!user){
  throw new UnauthenticatedError('Invalid credentials')
}

const isPasswordCorrect  = await user.comparePassword(password)
if(!isPasswordCorrect){
  throw new UnauthenticatedError('Invalid credentials')
}
//compare password

const token = user.createJWT()
res.status(200).json({user: {name:user.name} , token })




}

module.exports = {
    register,
    login,
}