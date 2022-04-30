import Router from '@koa/router'
import { authCheck } from './middlewares/auth-check'
import * as users from './modules/users'
import * as transactions from './modules/transactions'

export const router = new Router()

// Auth
router.get('/login', users.login)
router.post('/signup', users.signup)

// Users
router.put('/me', authCheck, users.update)
router.delete('/me', authCheck, users.remove)

// Transactions
router.post('/transactions', authCheck, transactions.create)
router.get('/transactions', authCheck, transactions.list)
router.put('/transactions/:id', authCheck, transactions.update)
router.del('/transactions/:id', authCheck, transactions.remove)
