import * as request from 'supertest'
import  knex, {Knex} from 'knex'
import dbConfig from "../../knexfile";
import {v4 as uuidv4} from 'uuid'
import app from '../server';
import {omit} from 'lodash/fp'
const knexDB = knex(dbConfig[process.env.NODE_ENV])

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
describe('USER SignUp', ()=>{
    let response
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
        }catch(e){
        }
    })
    afterAll(async () => {
        await knexDB.destroy();
      });
    describe('Request Succeeds if User is created successfully', ()=>{
        it('It should Return 201 status and user details', async ()=>{
        response = await request(app).post('/identity/signup').send(Args)
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('success', true)
        expect(Object.keys(response.body).sort()).toEqual([
            'success', 'id', 'name', 'email', 'account_number', 'role', 'created_at', 'updated_at'
        ].sort())
        })
    })
    describe('Request Fails if User is  Email is not Unique', ()=>{
        it('It should Return 409 status and user exist conflict', async ()=>{
        response = await request(app).post('/identity/signup').send(Args)
        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('error')
        expect(response.body).toHaveProperty('success', false)
        })
    })
    describe('Request Fails if User Request Payload is incomplete', ()=>{
        it('It should Return 400 status and user exist conflict', async ()=>{
        let newArgs = omit('email', Args)
        response = await request(app).post('/identity/signup').send(newArgs)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toHaveProperty('success', false)

        })
    })
})