import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// App Configuration
app.use(express.static('public'))
app.use(cookieParser())

// Bug LIST
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Bug SAVE (create / update)
app.get('/api/bug/save', (req, res) => {
    const { _id, title, description, severity } = req.query

    const bugToSave = {}
    if (_id) bugToSave._id = _id
    if (title) bugToSave.title = title
    if (description) bugToSave.description = description
    if (severity) bugToSave.severity = +severity

    bugService.saveBug(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Bug READ
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    const visitedBugs = req.cookies.visitedBugs || []
    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
        visitedBugs.push(bugId)
    }
    loggerService.info('User visited at the following bugs:', visitedBugs)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })

    bugService.getBugById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Bug DELETE
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    bugService.removeBug(bugId)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`Bug ${bugId} removed`)
        })
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

const port = 3030
app.listen(port, () => loggerService.info(`Server ready at http://127.0.0.1:${port}/`))
