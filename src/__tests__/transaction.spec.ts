import * as request from 'supertest'
import  knex, {Knex} from 'knex'
import dbConfig from "../../knexfile";
import {v4 as uuidv4} from 'uuid'
import app from '../server';
import {omit} from 'lodash/fp'
import {MockUser, MockedUserTwo} from '../__mock__/user'
const knexDB = knex(dbConfig[process.env.NODE_ENV])

describe('Transaction API', ()=>{
    let response
    let user
    let amount = 1000
    let receiver
    beforeAll(async ()=>{
        await knexDB.migrate.latest()
        user = await MockUser()
        receiver = await MockedUserTwo()
    })
    afterAll(async ()=>{
        await knexDB('users').del()
        await knexDB('user_wallet').del()
        await knexDB('transaction_logs').del()
        await knexDB.destroy()
    })
    describe('Deposit Into Account', ()=>{
        it('Deposit is Successful', async()=>{
            response = await request(app)
            .post('/transaction/deposit')
            .send({amount, userId: user.id})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('success', true)
            expect(response.body.message).toEqual(`${amount} Deposited Successfully`)
        })
  
        it('Deposit Fails when amount is not specified in the request payload', async()=>{
            response = await request(app)
            .post('/transaction/deposit')
            .send({userId: user.id})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(400)
            expect(response.body.error).toHaveProperty('success', false)
            expect(response.body).toHaveProperty('error')
        })
        it('Deposit Fails when user id is not specified in the request payload', async()=>{
            response = await request(app)
            .post('/transaction/deposit')
            .send({amount})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(400)
            expect(response.body.error).toHaveProperty('success', false)
            expect(response.body).toHaveProperty('error')
        })
        it('Deposit Fails when amount is not a positive number', async()=>{
            response = await request(app)
            .post('/transaction/deposit')
            .send({amount: -1000, userId: user.id})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(400)
            expect(response.body.error).toHaveProperty('success', false)
            expect(response.body).toHaveProperty('error')
        })
        it('Deposit Fails when user is not authenticated', async()=>{
            response = await request(app)
            .post('/transaction/deposit')
            .send({amount, userId: user.id})
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message', "User is not Authenticated")
        })
    })
    describe('Withdraw Into Account', ()=>{
        it('Withdraw is Successful', async()=>{
            response = await request(app)
            .post('/transaction/withdraw')
            .send({amount, userId: user.id})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('success', true)
            expect(response.body.message).toEqual(`${amount} Withdrawn from Wallet Successfully`)
        })
  
        it('Withdraw Fails when the required request payload is incomplete', async()=>{
            response = await request(app)
            .post('/transaction/withdraw')
            .send({userId: user.id})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(400)
            expect(response.body.error).toHaveProperty('success', false)
            expect(response.body).toHaveProperty('error')
        })
       
        it('Withdraw Fails when amount is not a positive number', async()=>{
            response = await request(app)
            .post('/transaction/withdraw')
            .send({amount: -1000, userId: user.id})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(400)
            expect(response.body.error).toHaveProperty('success', false)
            expect(response.body).toHaveProperty('error')
        })
        it('Withdraw Fails when Account balanv=ce is insufficient', async()=>{
            response = await request(app)
            .post('/transaction/withdraw')
            .send({amount: 100000000, userId: user.id})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('error', "Insufficient Fund")
        })
        it('Withdraw Fails when user is not authenticated', async()=>{
            response = await request(app)
            .post('/transaction/withdraw')
            .send({amount, userId: user.id})
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message', "User is not Authenticated")
        })
    })
    describe('Transfer From Account', ()=>{
        it('Transfer is Successful', async()=>{
            response = await request(app)
            .post('/transaction/transfer')
            .send({amount, userId: user.id, receiver: receiver.account_number, description: 'This is a description'})
            .set({'Authorization': `Bearer ${user.token}`})
            console.log(response.body)
            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('success', true)
            expect(response.body.message).toEqual(`${amount} Transferred Successfully`)
        })
        it('Transfer Fails when account balance is insufficient', async()=>{
            response = await request(app)
            .post('/transaction/transfer')
            .send({amount:100000, userId: user.id, receiver: receiver.account_number, description: 'This is a description'})
            .set({'Authorization': `Bearer ${user.token}`})
            console.log(response.body)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('error', "Insufficient Fund")
        })
  
        it('Transfer Fails when Receiver Account is not found', async()=>{
            response = await request(app)
            .post('/transaction/transfer')
            .send({userId: user.id, amount, receiver: '123456789'})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('error', "Receiver Wallet Not Found")
        })
        it('Transfer Fails when Request Payload is not complete', async()=>{
            response = await request(app)
            .post('/transaction/transfer')
            .send({amount})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(400)
            expect(response.body.error).toHaveProperty('success', false)
            expect(response.body).toHaveProperty('error')
        })
        it('Transfer Fails when amount is not a positive number', async()=>{
            response = await request(app)
            .post('/transaction/transfer')
            .send({amount: -1000, userId: user.id, receiver: receiver.account_number})
            .set({'Authorization': `Bearer ${user.token}`})
            expect(response.status).toBe(400)
            expect(response.body.error).toHaveProperty('success', false)
            expect(response.body).toHaveProperty('error')
        })
        it('Transfer Fails when user is not authenticated', async()=>{
            response = await request(app)
            .post('/transaction/transfer')
            .send({amount, userId: user.id, receiver: receiver.account_number})
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message', "User is not Authenticated")
        })
    })
})