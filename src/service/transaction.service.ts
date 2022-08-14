import knex from "knex";
import dbConfig from "../db/knexfile";
class TransactionService{
    static async Deposit(data){
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        const {amount, description, userId, reference, trx_type} = data
        try{
        const userWallet = await knexDB('user_wallet').where({userId}).first()
        if(userWallet == undefined) {
            return Promise.reject('No Wallet Found')
        }else{
        const newAmount = userWallet.amount + data.amount
        await knexDB('user_wallet').where({userId}).update({amount: newAmount})
        await knexDB('transaction_logs').insert({userId, amount, reference, trx_type, description, status: true})
        return userWallet
        }
    }catch(e){
        
            return e
        }

    }
    static async Withdraw(data){
        const {userId, amount, trx_type, reference, description,} = data
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        //check if balance is sufficient
        try{
            const userWallet = await knexDB('user_wallet').where({userId}).first()
            if(userWallet == undefined) return Promise.reject('No Wallet Found')
            if(userWallet.amount < amount) return Promise.reject('Insufficient Fund')
            const newAmount = userWallet.amount - amount
            await knexDB('user_wallet').where({userId}).update({amount: newAmount})
            await knexDB('transaction_logs').insert({userId, amount, trx_type, reference, description, status: true})
            return userWallet
        
        }catch(e){
            return e
        }

    }
    static async Transfer(data){
        const {userId, amount, receiverId, trx_type,description, reference} = data
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        try{
            const userWallet = await knexDB('user_wallet').where({userId}).first()
            const receiverWallet = await knexDB('user_wallet').where({userId: receiverId}).first()
            if(userWallet == undefined || receiverWallet == undefined) return Promise.reject('User Wallet Not Found')
            if(userWallet.amount < amount) return Promise.reject('Insufficient Fund')
            const receiverNewAmt = receiverWallet.amount + amount
            const userNewAmt = userWallet.amount - amount
            await knexDB('user_wallet').where({userId}).update({amount: userNewAmt})
            await knexDB('user_wallet').where({userId: receiverId}).update({amount: receiverNewAmt})
            const transaction = await knexDB('transaction_logs').insert({userId, sender: userId, receiver: receiverId, amount, trx_type, description, reference})
            return transaction
        }catch(e){
            return e
        }
    }
}
export default TransactionService