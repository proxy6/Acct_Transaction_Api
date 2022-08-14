import {NextFunction, Request, Response, Router} from 'express'
import { signUpValidation, loginValidation} from '../util/validation'
import UserController from '../controller/user.controller'
import { parseValidationError } from '../util/error'

const router = Router()
router.post('/signup', async (req: Request, res: Response, next: NextFunction)=>{
    const { error, value } = signUpValidation.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: {
          success: false,
          message: parseValidationError(error),
        },
      });
    }
    const {name, email, password, role} = value
    try{
      const data = await UserController.Signup({name, email, password, role})
      if(typeof data == 'object') return res.status(201).json({success: true, ...data})
      return res.status(404).json({success: false, error: data})
    }catch(e){
      res.status(409).json({success: false, error: e})
  }
})
router.post('/login', async(req: Request, res: Response, next: NextFunction)=>{
  const {error, value} = loginValidation.validate(req.body)
  if(error){
    return res.status(400).json({
      error:{
        status: false,
        message: parseValidationError(error)
      }
    })
  }
  try{
    const data = await UserController.Login(value)
    if(data == undefined) return res.status(404).json({success: false, error: "User Does Not Exist"}) 
    if(data == false) return res.status(401).json({success: false, error: "Password Incorrect!"})
    res.status(201).json({success: true, data})
    
  }catch(e){
  res.json({success: false, error: e})
  }
})
// router.post('/login', login)

export default router
