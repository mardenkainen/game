const ApiError=require('../error/ApiError')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {User}=require('../models/models')

const generateAccessToken=(user)=>{
    const payload = {
        id:user.id,
        email:user.email,
        role:user.role}
    return jwt.sign(payload,process.env.SECRET_KEY, {expiresIn: "24h"})
}

class UserController{
    async registration(req,res,next){
        const {email,password,role} = req.body
        if (!email || !password){
            return next(ApiError.badRequest('Incorrect email or password'))
        }
        const  candidate=await User.findOne({where: {email}})
        if (candidate){
            return next(ApiError.badRequest('User with this emil already exist'))
        }
        const hashPassword= await bcrypt.hash(password,4)
        const user=await User.create({email,role,password: hashPassword})
        const token=generateAccessToken(user)
        return res.json({token})
    }



    async login(req,res,next){
        const {email,password} = req.body
        const  user= await User.findOne({where:{email}})
        if (!user){
            return next(ApiError.internal("User not found"))
        }
        let comparePassword= bcrypt.compareSync(password,user.password)
        if (!comparePassword){
            return next(ApiError.internal("Wrong Password"))
        }
        const token=generateAccessToken(user)
        return res.json({token})
    }


    async check(req,res,next){
        const token=generateAccessToken(req.user)
        return res.json({token})
    }

    async getAll(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }
}


module.exports=new UserController()