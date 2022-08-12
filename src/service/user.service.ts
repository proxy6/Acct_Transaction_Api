
import dbConfig from "../db/knexfile";
import knex from 'knex'
import {omit} from 'lodash/fp'

class UserService{
   static async SignUp(userData){
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        const {name, email, userPassword, role} = userData
        try{ 
            const user = await knexDB("users").insert({
                name,
                email,
                password:userPassword,
                role: role || "user"
            })
            const newUser = await knexDB('users').where('id', user[0]).first()
            const wallet = await knexDB('user_wallet').insert({
                userId: newUser.id   
            })
            newUser.password = ''
            return newUser
        }catch(e){
           console.log(e)
           throw new Error('Unable to Signup User')
        }
   }
   static async Login(data){
    const {email} = data
    try{
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        const user = await knexDB('users').where({email}).first()
        if(typeof user == undefined) return Promise.reject("User Exists")
        return user
    }catch(e){
       return e 
    }
   } 
}
export default UserService;