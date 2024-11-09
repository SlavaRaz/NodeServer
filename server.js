import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser'


const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(express.static('public'))

app.get('/api/bug', (req, res) => {
    const filterBy = {

        txt: req.query.txt || '',
        severity: req.query.severity || 0,
        pageIdx: req.query.pageIdx ,
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

    const bugToSave = req.body
    console.log(bugToSave)
    bugService
        .save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot add bug', err)
            res.status(500).send('Cannot add bug', err)
        })
})

app.put('/api/bug/:bugId', (req, res) => {

    const bugToSave = req.body
    console.log(bugToSave)
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
    console.log(visitedBugs)

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
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(bugId + ' Removed Successfully!'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
