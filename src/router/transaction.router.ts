import {NextFunction, Request, Response, Router} from 'express'
import { walletValidation, transferValidation } from '../util/validation'
import { parseValidationError } from '../util/error'
import AccountController from '../controller/transaction.controller'

const router = Router()

router.post('/deposit', async (req: Request, res: Response, next: NextFunction)=>{
    //validate request body
    const { error, value } = walletValidation.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: {
          success: false,
          message: parseValidationError(error),
        },
      });
    }
    try{
        let deposit = await AccountController.deposit(value)
        if(typeof deposit == 'object') return res.status(201).json({success: true, message: `${value.amount} Deposited Successfully`})
        return res.status(404).json({error: deposit});
    }catch(e){
      res.status(500).json({error: e})}

})

router.post('/withdraw', async (req: Request, res: Response, next: NextFunction)=>{
    //validate request body
    const {error, value} = walletValidation.validate(req.body)
    if(error){
      return res.status(400).json({
        error:{
          success:false,
          message: parseValidationError(error)
        }
      })
    }
    try{
      const withdraw = await AccountController.withdraw(value)
      if(typeof withdraw == 'object') return res.status(201).json({success: true, message: `${value.amount} Withdrawn from Wallet Successfully`})
      return res.status(404).json({error: withdraw});
    }catch(e){
      res.status(500).json({error: e})
    }
    
})
router.post('/transfer', async (req: Request, res: Response, next: NextFunction)=>{
     //validate request body
     const {error, value} = transferValidation.validate(req.body)
     if(error){
       return res.status(400).json({
         error:{
           success:false,
           message: parseValidationError(error)
         }
       })
     }
     try{
       const withdraw = await AccountController.transfer(value)
       if(typeof withdraw == 'object') return res.status(201).json({success: true, message: `${value.amount} Transferred Successfully`})
       return res.status(404).json({error: withdraw});
     }catch(e){
       res.status(404).json({error: e})
     }
     
})

export default router
