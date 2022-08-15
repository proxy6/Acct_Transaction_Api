import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user_wallet', wallet => {
        wallet.increments('id').primary()
        wallet.integer("userId").notNullable().unique();
        wallet.float ('amount').notNullable().defaultTo(0.00);
        wallet.timestamp('created_at').defaultTo(knex.fn.now())
        wallet.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user_wallet');
}

