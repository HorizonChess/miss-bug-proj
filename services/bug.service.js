import { utilService } from './util.service.js'

export const bugService = {
    query,
    getBugById,
    removeBug
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

function removeBug(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject(`Bug ${bugId} not found`)

    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('data/bug.json', bugs)
}
