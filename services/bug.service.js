import { utilService } from './util.service.js'

export const bugService = {
    query,
    getBugById,
    removeBug,
    saveBug
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

function saveBug(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        if (idx === -1) return Promise.reject(`Bug ${bugToSave._id} not found`)

        bugs[idx] = { ...bugs[idx], ...bugToSave }
        bugToSave = bugs[idx]
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.push(bugToSave)
    }

    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('data/bug.json', bugs)
}
