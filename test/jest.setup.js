require('dotenv-safe/config')
const { execSync } = require('child_process')
const request = require('supertest')

process.env.DB_URL = `${process.env.DB_URL}_testdb?schema=test_schema`
execSync('yarn db:migrate')
const { app } = require('../src/serverSetup')

let server

beforeAll(() => {
    server = app.listen()
    global.testRequest = request(server)
})

afterAll(async () => {
    await server.close()
})
