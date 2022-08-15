import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transaction_logs', table => {
        table.increments('id').primary()
        table.integer("userId").notNullable()
        table.integer('sender').nullable()
        table.integer('receiver').nullable()
        table.float ('amount').notNullable().defaultTo(0.00);
        table.enum('trx_type', ['DEBIT', 'CREDIT']).notNullable;
        table.string('description', 255).nullable()
        table.string('reference', 255).notNullable()
        table.boolean('status').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transaction_logs');
}

