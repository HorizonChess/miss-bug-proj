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

app.listen(3030, () => console.log('Server ready at port 3030'))
