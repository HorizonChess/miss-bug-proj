import { utilService } from './util.service.js'

export const bugService = {
    query
}

const bugs = utilService.readJsonFile('data/bug.json')

function query() {
    return Promise.resolve(bugs)
}
