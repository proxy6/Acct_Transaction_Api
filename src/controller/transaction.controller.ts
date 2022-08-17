import AccountService from "../service/transaction.service"
import {v4 as uuidv4} from 'uuid' 
import knex from "knex"
class AccountController{
    static async deposit(data){
        try{
        data.amount = parseFloat(data.amount)
        const reference  = `Deposit_${uuidv4().replace(/-/g, '')}`
        let deposit = await AccountService.deposit({...data, reference, trx_type: "CREDIT" })
        return deposit
        }catch(e){
            return e
            
        }
    }
    static async withdraw(data){
        try{
            data.amount = parseFloat(data.amount)
            const reference = `Withdraw_${uuidv4().replace(/-/g, '')}`
            const withdraw = await AccountService.withdraw({...data, reference, trx_type: "DEBIT"})
            return withdraw
        }catch(e){
            return e
        }
    }
    static async transfer(data){
        try{
        data.amount = parseFloat(data.amount)
        const reference = `Transfer_${uuidv4().replace(/-/g, '')}`
        //confirm account details
        const receiver = await AccountService.getAccountDetails(data.receiver)
        if(receiver == undefined)return Promise.reject('Receiver Wallet Not Found')
            const receiverId = receiver.id
            const transfer = await AccountService.transfer({...data, reference, receiverId, trx_type: "DEBIT"})
            return transfer 
        }catch(e){
            return e
        }
    }
}

export default AccountController