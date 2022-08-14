import * as dotenv from 'dotenv'
dotenv.config();

const {
	NODE_ENV,
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_NAME
} = process.env;

module.exports = {
	[NODE_ENV]: {
		username: DB_USER,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOST,
		dialect: 'postgres',
		port: DB_PORT
	}
};
