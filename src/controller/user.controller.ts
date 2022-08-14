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
      const token = await GenerateSignature({_id: newUser.id, role: newUser.role})
      const returnedUser = {newUser, token}
      return returnedUser 
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
           const token = await GenerateSignature({data:{email:user.email, _id: user._id, role: user.role}})
           user.password = ''
           const returnedUser = {user, token}
           return returnedUser 
        }else{
          return Promise.reject('Password Incorrect')
        }   
    }catch(e){
        return e
    }
  }
}

export default UserController





