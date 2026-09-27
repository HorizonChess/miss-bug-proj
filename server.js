import express from 'express'

import { bugService } from './services/bug.service.js'

const app = express()

app.get('/', (req, res) => res.send('Hello there'))

// Bug LIST
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Bug READ
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    bugService.getBugById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

app.listen(3030, () => console.log('Server ready at port 3030'))
