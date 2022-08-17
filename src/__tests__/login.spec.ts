import * as request from 'supertest'
import  knex, {Knex} from 'knex'
import dbConfig from "../../knexfile";
import {v4 as uuidv4} from 'uuid'
import app from '../server';
import {omit} from 'lodash/fp'
import {v4 as uuid} from 'uuid'
import UserController from '../controller/user.controller'
const knexDB = knex(dbConfig[process.env.NODE_ENV])

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
describe('USER Login', ()=>{
    let response
    let dummyArg
    let user
    let dummyEmail = `${uuidv4().replace(/-/g, '')}@gmail.com`
    let dummyPass = uuidv4().replace(/-/g, '')
    let Args ={
        name: 'Dummy Name',
        email: dummyEmail,
        password: dummyPass,
        role: 'user'
    }
    beforeAll(async ()=>{
        try{
        await knexDB.migrate.latest();
        user = await UserController.signUp(Args)
        }catch(e){
            console.log(e)
        }
    })
    afterAll(async () => {
        await knexDB('users').del();
      });
    describe('Request Succeeds if User Logged in successfully', ()=>{
        it('It should Return 201 status and user details', async ()=>{
        response = await request(app).post('/identity/login').send({email:dummyEmail, password: dummyPass})
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('token')
        expect(Object.keys(response.body).sort()).toEqual([
            'id', 'name', 'email', 'role', 'account_number', 'success', 'token', 'created_at', 'updated_at'
        ].sort())
        })
    })
    describe('Request Fails if User Account Does not Exist', ()=>{
        it('It should Return 404 status and user does not exist details', async ()=>{
            dummyArg = {
                email: `${uuidv4().replace(/-/g, '')}@gmail.com`,
                password: dummyPass
            }
        response = await request(app).post('/identity/login').send(dummyArg)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error', "User or Password Incorrect")
        expect(response.body).toHaveProperty('success', false)
        })
    })
    describe('Request Fails if User Password is not correct', ()=>{
        it('It should Return 404 status and user does not exist details', async ()=>{
            dummyArg = {
                email: dummyEmail,
                password: 'wrongpassword'
            }
        let newPass = 
        response = await request(app).post('/identity/login').send(dummyArg)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error', "User or Password Incorrect")
        expect(response.body).toHaveProperty('success', false)
        })
    })
    describe('Request Fails if User Request Payload is incomplete', ()=>{
        it('It should Return 400 status if user request payload is not complete', async ()=>{
            dummyArg = {
                email: dummyEmail,
                password: dummyPass
                }
        let newArgs = omit('email', dummyArg)
        response = await request(app).post('/identity/login')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toHaveProperty('status', false)

        })
    })
})