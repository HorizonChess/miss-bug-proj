import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

const app = express()

// App Configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Bug LIST
app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)

    bugService.query(queryOptions)
        .then(result => res.send(result))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

function parseQueryParams(queryParams) {
    let labels = queryParams.labels || []
    if (!Array.isArray(labels)) labels = [labels]

    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels
    }

    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir === -1 ? -1 : 1
    }

    // No pageIdx sent means paging is off: return all bugs
    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : undefined,
        pageSize: +queryParams.pageSize || 3
    }

    return { filterBy, sortBy, pagination }
}

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

// Bug CREATE
app.post('/api/bug', (req, res) => {
    const { title, description, severity, labels } = req.body
    if (!title || !severity) return res.status(400).send('Missing title or severity')

    const bugToSave = {
        title,
        description: description || '',
        severity: +severity,
        labels: Array.isArray(labels) ? labels : []
    }

    bugService.saveBug(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot add bug', err)
            res.status(400).send('Cannot add bug')
        })
})

// Bug UPDATE
app.put('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { title, description, severity, labels } = req.body

    const bugToSave = { _id: bugId }
    if (title) bugToSave.title = title
    if (description !== undefined) bugToSave.description = description
    if (severity) bugToSave.severity = +severity
    if (Array.isArray(labels)) bugToSave.labels = labels

    bugService.saveBug(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot update bug', err)
            res.status(400).send('Cannot update bug')
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

// User LIST
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(400).send('Cannot get users')
        })
})

// User READ
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getUserById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot get user')
        })
})

const port = 3030
app.listen(port, () => loggerService.info(`Server ready at http://127.0.0.1:${port}/`))
