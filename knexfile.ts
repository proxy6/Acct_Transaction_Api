import type { Knex } from "knex";
import config from "./src/util/config";
// import * as dotenv from 'dotenv'
// dotenv.config({ debug: true })
// Update with your config settings.
// console.log(process.env)
const dbConfig: { [key: string]: Knex.Config } = {
  production: {
    client: "mysql",
    connection: {
      host : process.env.DB_HOST,
      port : 3306,
      database: process.env.DB_NAME,
      user:process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },
  
  development: {
    client: "mysql",
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : `${process.env.DB_DATABASE}`
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
      database : `${process.env.DB_DATABASE_TEST}`
      
    },  
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },

  staging: {
    client: "mysql",
    connection: {
      host : config.DB_SERVER,
      port : parseInt(config.DB_PORT),
      database: config.DB_DATABASE,
      user:config.DB_USER,
      password: config.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

 

};
export default dbConfig
