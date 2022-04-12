import Router from '@koa/router'
import * as users from './modules/users'
import * as transactions from './modules/transactions'

export const router = new Router()

// Auth
router.get('/login', users.login)

// Users
router.get('/users', users.list)
router.post('/users', users.create)
router.put('/users/:id', users.update)
router.delete('/users/:id', users.remove)

// Transactions
router.post('/transactions', transactions.create)
