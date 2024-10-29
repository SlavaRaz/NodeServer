import express from 'express'

const app = express()
app.get('/api/bug', (req, res) =>
    res.send('Hello there '))
app.listen(3030, () =>
    console.log('Server ready at port http://127.0.0.1:3030'))