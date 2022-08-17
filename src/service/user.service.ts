
import dbConfig from "../../knexfile";
import knex from 'knex'
import {omit} from 'lodash/fp'

class UserService{
   static async SignUp(userData){
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        const {name, email, userPassword, role} = userData
        try{ 
            const newUser = await knexDB("users").insert({
                name,
                email,
                password:userPassword,
                role: role || "user"
            })
            const user = await knexDB('users').where('id', newUser[0]).first()
            const returnedUser = omit('password', user)
            return returnedUser
        }catch(e){
           throw new Error('Unable to Signup User')
        }
   }
   static async Login(data){
    const {email} = data
    try{
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        const user = await knexDB('users').where({email}).first()
        if(typeof user == undefined) return user
        return user
    }catch(e){
       return e 
    }
   } 
}
export default UserService;