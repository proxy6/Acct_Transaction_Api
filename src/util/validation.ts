import * as Joi from 'joi';
// import {User} from '../model/user.model';

export const signUpValidation = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    role: Joi.string().trim()
})
export const loginValidation = Joi.object({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
})

export const walletValidation = Joi.object({
    amount: Joi.number().positive().required(),
    userId: Joi.number().required(),
    description: Joi.string(),
})
export const transferValidation = Joi.object({
    amount: Joi.number().positive().required(),
    userId: Joi.number().required(),
    description: Joi.string(),
    receiverId: Joi.number().required()
})
