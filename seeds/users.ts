import { Knex } from "knex";
import { HashPassword } from "../src/util/auth";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    const userPass = await HashPassword("dummytext")
    await knex("users").insert([
        {id: 1, name: 'Hettie Marshall', email: 'lantunde@acbo.va', role: "admin", password: userPass},
        {id: 2, name: 'Hester Owens', email: 'zo@girih.lv', role: "user", password: userPass},
        {id: 3, name: 'Henry Jackson', email: 'bekamohi@owo.mt', role: "user", password: userPass}
    ]);
};
