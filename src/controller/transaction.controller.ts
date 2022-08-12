import TransactionService from "../service/transaction.service"
import {v4 as uuidv4} from 'uuid' 
import knex from "knex"
import dbConfig from "src/db/knexfile"
class TransactionController{
    static async Deposit(data){
        try{
        data.amount = parseFloat(data.amount)
        const reference  = `Deposit_${uuidv4().replace(/-/g, '')}`
        let deposit = await TransactionService.Deposit({...data, reference, trx_type: "CREDIT" })
        return deposit
        }catch(e){
            return e
            
        }
        
    }
    static async Withdraw(data){
        try{
            data.amount = parseFloat(data.amount)
            const reference = `Withdraw_${uuidv4().replace(/-/g, '')}`
            const withdraw = await TransactionService.Withdraw({...data, reference, trx_type: "DEBIT"})
            return withdraw
        }catch(e){
            return e
        }
    }
    static async Transfer(data){
        try{
        data.amount = parseFloat(data.amount)
        const reference = `Withdraw_${uuidv4().replace(/-/g, '')}`
        const transfer = await TransactionService.Transfer({...data, reference, trx_type: "DEBIT"})
        return transfer 
        }catch(e){
            return e
        }
    }
}

export default TransactionController