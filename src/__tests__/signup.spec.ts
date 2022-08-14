import * as request from 'supertest'
import knex, { Knex } from 'knex'
import dbConfig from "../db/knexfile";
import {v4 as uuidv4} from 'uuid'
import UserController from '../controller/user.controller';
import { omit } from 'lodash/fp';
import app from 'src/server';
const knexDB = knex(dbConfig[process.env.NODE_ENV])
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
describe('USER SIGNUP Controller', ()=>{
    let response
    let Args ={
        name: 'Dummy Name',
        email: `${uuidv4().replace(/-/g, '')}@gmail.com`,
        password:uuidv4().replace(/-/g, ''),
        role: 'user'
    }
    beforeEach(async ()=>{
        await sleep(2000);
    })
    afterAll(async () => {
        await knexDB.destroy();
      });
    
    // beforeAll(async()=>{
    //     const knexDB = await knex(dbConfig[process.env.NODE_ENV])
    //     console.log(process.env.NODE_ENV)
    //     let test = await knexDB.migrate.latest()
    //     console.log(test)
    //     // const knexDB = await knex(dbConfig[process.env.NODE_ENV])
    //     // await knexDB('users').insert({
    //     //     name: 'Dummy',
    //     //     email: '12@gmail.com',
    //     //     password: '1234',
    //     //     role: 'user'
    //     // })
    // })

    // afterAll(async ()=>{
    //     // await knexDB("users").truncate()
    //     await knexDB("users").del()
    //     await knexDB.destroy()
    // afterEach(done =>{
    //      server.close(done)
    // });
    // afterAll(async()=> {await knexDB.destroy()
    // });
        
    // })
    describe('Request Succeeds if Request Payload is complete', ()=>{
        let response
    
        beforeAll(async()=>{
            response = await UserController.Signup({...Args})
        })
        it('returns new user details', ()=>{
            expect(response).toHaveProperty('token')
            expect(Object.keys(response.newUser).sort()).toEqual(
                ['id', 'name', 'email', 'role', 'created_at', 'updated_at'].sort()
            )
         
        })
        
        // it('returns status 400 with error message', ()=>{
        //     expect(response.status).toBe(400)
        //     expect(response.body).toHaveProperty('error')
        // })
        
    })
    describe('Request Fails if Email is not Unique', ()=>{
        // beforeAll(async()=>{
        //     response = await UserController.Signup({...Args})
    
        // })
        it('returns error message of Email Exists', ()=>{
            console.log({...Args})
            expect(async ()=>{
                await UserController.Signup({...Args})
            }).toThrowError("User Exists")
        })
        
    })
    //  describe('Request Fails if Request Payload is Empty incomplete', ()=>{
    //     let incomplete = [omit('email', Args), omit('password', Args), omit('name', Args) ]
    //     beforeAll(async()=>{
    //         response = await UserController.Signup({...incomplete})
    //         console.log(response.body)
    //     })
    //     it.each(incomplete)('Returns Error Message for The Required Request Load Missing', (message)=>{
    //         console.log(message)
    //         console.log(response)
    //         expect(response).toHaveProperty('Error')
    //     })
    // //     // it('returns status 400 with error message', ()=>{
    // //     //     expect(response.status).toBe(400)
    // //     //     expect(response.body).toHaveProperty('error')
    // //     // })
        
    // })
    
    // describe('Request Succeds and User is Created', ()=>{
    //     let response
    //     let Args ={
    //         name: 'Dummy Name',
    //         email: `${uuidv4().replace(/-/g, '')}@gmail.com`,
    //         password:uuidv4().replace(/-/g, '') 
    //     }
    //     beforeAll(async()=>{
    //         response = request(app).post('/identity/signup').send(Args)
    //     })
        // it('returns status 409 with error message', ()=>{
        //     expect(response.status).toBe(201)
        //     expect(response.body).toHaveProperty('success', true)
        //     expect(response.body).toHaveProperty('token')
        //     expect(Object.keys(response.body.newUser).sort()).toEqual(
        //         ['id', 'name', 'email', 'password', 'role', 'created_at', 'updated_at'].sort()
        //     )
        // })
        
    // })

    // describe('Request Fails if Request Payload is Empty incomplete', ()=>{
    //     let response
    //     beforeAll(async()=>{
    //         response = request(app).post('/identity/signup')
    //         console.log(response.body)
    //     })
    //     it('returns status 400 with error message', ()=>{
    //         expect(response.status).toBe(400)
    //         expect(response.body).toHaveProperty('error')
    //     })
        
    // })
    // describe('Request Fails if Email is not Unique', ()=>{
    //     let response
    //     beforeAll(async()=>{
    //         response = request(app).post('/identity/signup').send()
    //     })
    //     it('returns status 409 with error message', ()=>{
    //         expect(response.status).toBe(409)
    //         expect(response.body).toHaveProperty('error', "User Exists")
    //     })
        
    // })
    // describe('Request Succeds and User is Created', ()=>{
    //     let response
    //     let Args ={
    //         name: 'Dummy Name',
    //         email: `${uuidv4().replace(/-/g, '')}@gmail.com`,
    //         password:uuidv4().replace(/-/g, '') 
    //     }
    //     beforeAll(async()=>{
    //         response = request(app).post('/identity/signup').send(Args)
    //     })
        // it('returns status 409 with error message', ()=>{
        //     expect(response.status).toBe(201)
        //     expect(response.body).toHaveProperty('success', true)
        //     expect(response.body).toHaveProperty('token')
        //     expect(Object.keys(response.body.newUser).sort()).toEqual(
        //         ['id', 'name', 'email', 'password', 'role', 'created_at', 'updated_at'].sort()
        //     )
        // })
        
    // })
})