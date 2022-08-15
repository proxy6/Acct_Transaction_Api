import {Request, Response} from 'express'
import UserService from '../service/user.service'
import { GenerateSignature, HashPassword, validatePassword } from '../util/auth'



class UserController{
  static async Signup(data){
    let {name, email, password, role} = data
    try{ 
      const userPassword = await HashPassword(password)
      const existingUser = await UserService.Login({email, userPassword}); 
      if(typeof existingUser == 'object') return Promise.reject('User Exists');  
      const newUser = await UserService.SignUp({name, email, userPassword, role})
      return newUser
    }catch(e){
      return e
    }
  }

  static async Login(userData){
      let {email, password} = userData
      try{
        const user = await UserService.Login({email})
        if(user == undefined) return user
        const validatePass = await validatePassword(password, user.password)
        if(validatePass == true){
          const token = await GenerateSignature({_id: user.id, role: user.role})
           user.password = ''
           const returnedUser = {user, token}
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





