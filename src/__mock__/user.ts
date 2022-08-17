import {v4 as uuidv4} from 'uuid'
import UserController from '../controller/user.controller';
import AccountController from '../controller/transaction.controller'

export const MockUser = async () => {
	let email =  `${uuidv4()}@gmail.com`
	let password = 'examplepassword'
		let NewUser = {
			name: 'Dummy Name',
			email,
			password,
			role: "user"
		};
	const user = await UserController.Signup(NewUser)
	const deposit = await AccountController.Deposit({userId: user.id, amount: 5000})
	const LoggedInUser = await UserController.Login({email, password})
	return  LoggedInUser
};
export const MockedUserTwo = async () => {
	let email =  `${uuidv4()}@gmail.com`
	let password = 'examplepassword'
		let NewUser = {
			name: 'Dummy Name',
			email,
			password,
			role: "user"
		};
	const user = await UserController.Signup(NewUser)
	return  user
};