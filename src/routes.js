import Router from '@koa/router'
import { authCheck } from './middlewares/auth-check'
import * as users from './modules/users'
import * as transactions from './modules/transactions'

export const router = new Router()

// Auth
router.get('/login', users.login)

// Users
router.post('/users', users.create)

router.get('/users', authCheck, users.list)
router.put('/users/:id', authCheck, users.update)
router.delete('/users/:id', authCheck, users.remove)

// Transactions
router.post('/transactions', authCheck, transactions.create)
router.get('/transactions', authCheck, transactions.list)
