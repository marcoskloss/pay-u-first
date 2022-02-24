import { app } from './serverSetup'

app.listen(process.env.SERVER_PORT, () => {
    console.log('server is running at', process.env.SERVER_PORT)
})
