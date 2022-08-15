import * as dotenv from 'dotenv'
dotenv.config();

const config =  {
	NODE_ENV:  process.env.NODE_ENV,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_DATABASE: process.env.DB_DATABASE,
	DB_SERVER: process.env.DB_SERVER
}

export default config