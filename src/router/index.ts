import { Router } from 'express';
import UserRoute from './user.router'
import transaction from './transaction.router'
import { isAuthorized } from '../middleware/auth';

const router = Router();

router.get('/', (req, res)=>{
    res.status(200).send("Welcome to Account Transaction API ")
})
router.use('/identity', UserRoute);
router.use('/transaction', isAuthorized('user'), transaction)

export default router;
