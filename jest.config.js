require('dotenv-safe/config')
const { execSync } = require('child_process')

process.env.DB_URL = `${process.env.DB_URL}_testdb?schema=test_schema`
execSync('yarn prisma migrate deploy')

module.exports = {}
