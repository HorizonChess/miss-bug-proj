import { utilService } from './util.service.js'

export const bugService = {
    query,
    getBugById,
    removeBug,
    saveBug
}

const bugs = utilService.readJsonFile('data/bug.json')

function query({ filterBy = {}, sortBy = {} } = {}) {
    let bugsToReturn = [...bugs]

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels && filterBy.labels.length) {
        bugsToReturn = bugsToReturn.filter(bug =>
            filterBy.labels.some(label => bug.labels && bug.labels.includes(label))
        )
    }

    const { sortField, sortDir } = sortBy
    if (sortField === 'title') {
        bugsToReturn.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title) * sortDir)
    } else if (sortField === 'severity' || sortField === 'createdAt') {
        bugsToReturn.sort((bug1, bug2) => (bug1[sortField] - bug2[sortField]) * sortDir)
    }

    return Promise.resolve(bugsToReturn)
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
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('data/bug.json', bugs)
}
