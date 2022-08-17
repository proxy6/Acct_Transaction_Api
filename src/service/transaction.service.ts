import knex from "knex";
import dbConfig from "../../knexfile";
class AccountService{
    static async createAccount(data, account_number){
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        await knexDB('user_wallet').insert({
            userId: data.id,
            account_number,   
        })
        return
    }
    static async deposit(data){
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
    static async withdraw(data){
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
    static async transfer(data){
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
    static async getAccountNumber(id){
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        const wallet = await knexDB('user_wallet')
        .where({userId: id}).select('account_number').first()
       
        return wallet
    }
    static async getAccountDetails(account_number){
        const knexDB = knex(dbConfig[process.env.NODE_ENV])
        const wallet = await knexDB('user_wallet').where({account_number}).select('userId').first()
        if(wallet == undefined) return wallet
        const user = await knexDB('users').where({id: wallet.userId}).first()
       
        return user
    }
}
export default AccountService