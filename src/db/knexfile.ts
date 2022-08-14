import type { Knex } from "knex";
import * as dotenv from 'dotenv'
dotenv.config({ path: '../../.env', debug: true })
// Update with your config settings.

const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql",
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : "lenddb"
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },

  test: {
    client: "mysql",
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : "lenddb_test"
    },  
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },

  staging: {
    client: "mysql",
    connection: {
      host : process.env.SERVER,
      port : parseInt(process.env.DB_PORT),
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "mysql",
    connection: {
      host : process.env.SERVER,
      port : parseInt(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};
export default dbConfig
