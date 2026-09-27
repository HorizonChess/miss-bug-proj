import { utilService } from './util.service.js'

export const bugService = {
    query,
    getBugById
}

const bugs = utilService.readJsonFile('data/bug.json')

function query() {
    return Promise.resolve(bugs)
}

function getBugById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject(`Bug ${bugId} not found`)
    return Promise.resolve(bug)
}
