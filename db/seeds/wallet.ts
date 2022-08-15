import { Knex } from "knex";
import { HashPassword } from "../../src/util/auth";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user_wallet").del();

    // Inserts seed entries
    const userPass = await HashPassword("dummytext")
    await knex("user_wallet").insert([
        {id: 1, userId: 2, amount: 500.05 },
        {id: 2,  userId: 1, amount: 650.01},
        {id: 3,  userId: 3, amount: 1000.10}
    ]);
};
