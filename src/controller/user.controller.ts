
import UserService from '../service/user.service'
import AccountService from '../service/transaction.service'
import { GenerateSignature, HashPassword, validatePassword } from '../util/auth'
import {omit} from 'lodash/fp'
import {v4 as uuid} from 'uuid'


class UserController{
  static async signUp(data){
    let {name, email, password, role} = data
    let random = uuid().replace(/-/g, '')
    let account_number = (random.replace(/\D/g, '') ).substring(0, 10)
    try{ 
      const userPassword = await HashPassword(password)
      const existingUser = await UserService.login({email, userPassword}); 
      if(existingUser == undefined){
        const newUser = await UserService.signUp({name, email, userPassword, role})
        const createAccount = await AccountService.createAccount(newUser, account_number)
        return {...newUser, account_number}
      }else{
        return Promise.reject('User Exists');
      }  
    }catch(e){
      return e
    }
  }
  static async login(userData){
      let {email, password} = userData
      try{
        const existingUser = await UserService.login({email})
        if(existingUser == undefined) return Promise.reject('User or Password Incorrect')
        const validatePass = await validatePassword(password, existingUser.password)
        if(validatePass == true){
          const wallet = await AccountService.getAccountNumber(existingUser.id)
          const token = await GenerateSignature({_id: existingUser.id, email: existingUser.email, role: existingUser.role})
          const user = omit('password', existingUser)
          let account_number = (wallet.account_number)
           const returnedUser = {...user, account_number, token}
           return returnedUser 
        }else{
          return Promise.reject('User or Password Incorrect')
        }   
    }catch(e){
        return e
    }
  }
}


export default UserController





