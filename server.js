import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'


const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(express.static('public'))

app.get('/api/bug', (req, res) => {
    const filterBy = {

        txt: req.query.txt || '',
        severity: req.query.severity || 0,
        pageIdx: req.query.pageIdx,
        labels: req.query.labels ? req.query.labels.split(',') : '',
        sortBy: req.query.sortBy || 'title',
        sortDir: req.query.sortDir || 1,
    }
    console.log(filterBy)

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
            console.log('cannot get bugs', err)
        })
})

app.post('/api/bug', (req, res) => {

    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Unauthenticated')
    console.log(user)

    const bugToSave = req.body
    bugService
        .save(bugToSave, user)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot add bug', err)
            res.status(500).send('Cannot add bug', err)
        })
})

app.put('/api/bug/:bugId', (req, res) => {

    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Unauthenticated')

    const bugToSave = req.body
    bugService
        .save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot update bug', err)
            res.status(500).send('Cannot update bug', err)
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []

    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }
    if (visitedBugs.length > 3) {
        loggerService.error(`User visited more than 3 bugs: ${visitedBugs}`)
        return res.status(401).send('Wait for a bit')
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 60000 })
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {

    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Unauthenticated')

    const { bugId } = req.params
    bugService.remove(bugId, user)
        .then(() => res.send(bugId + ' Removed Successfully!'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

// Auth API
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(404).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
