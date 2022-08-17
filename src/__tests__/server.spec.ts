import * as request from 'supertest'
import app from '../server'

describe('Test the Application Root Path', ()=>{
    test('it should return success response for the get method', async()=>{
        const response = await request(app).get('/')
        expect(response.status).toBe(200)
    })
})