import express from 'express'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.get('/', (req, res) => res.send('Hello there'))

// Bug LIST
app.get('/api/bug', (req, res) => {
    bugService.query()
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

    bugService.getBugById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Bug DELETE
app.get('/api/bug/:bugId/remove', (req, res) => {
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
