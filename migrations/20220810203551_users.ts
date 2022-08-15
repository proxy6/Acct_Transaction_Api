import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', user => {
        user.increments('id').primary()
        user.string("name", 255).notNullable();
        user.string('email', 255).unique()
        user.string('password', 255).notNullable();
        user.enum('role', ['user', 'admin']).notNullable;
        user.timestamp('created_at').defaultTo(knex.fn.now())
        user.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}


