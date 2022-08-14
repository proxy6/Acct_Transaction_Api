import type { Knex } from "knex";

// Update with your config settings.
console.log(process.env.DB_DATABASE)
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
    client: "mysql2",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
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
