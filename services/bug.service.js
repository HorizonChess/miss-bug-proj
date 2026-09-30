import { utilService } from './util.service.js'

export const bugService = {
    query,
    getBugById,
    removeBug,
    saveBug
}

export const NOT_ALLOWED = 'Not your bug'

const bugs = utilService.readJsonFile('data/bug.json')

function query({ filterBy = {}, sortBy = {}, pagination = {} } = {}) {
    const result = {}
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

    if (filterBy.creatorId) {
        bugsToReturn = bugsToReturn.filter(bug => bug.creator && bug.creator._id === filterBy.creatorId)
    }

    const { sortField, sortDir } = sortBy
    if (sortField === 'title') {
        bugsToReturn.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title) * sortDir)
    } else if (sortField === 'severity' || sortField === 'createdAt') {
        bugsToReturn.sort((bug1, bug2) => (bug1[sortField] - bug2[sortField]) * sortDir)
    }

    if (pagination.pageIdx !== undefined) {
        const { pageIdx, pageSize } = pagination
        const startIdx = pageIdx * pageSize

        result.pageCount = Math.ceil(bugsToReturn.length / pageSize)
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + pageSize)
    }

    result.bugs = bugsToReturn
    return Promise.resolve(result)
}

function getBugById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject(`Bug ${bugId} not found`)
    return Promise.resolve(bug)
}

function removeBug(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject(`Bug ${bugId} not found`)
    if (!_isAllowed(bugs[idx], loggedinUser)) return Promise.reject(NOT_ALLOWED)

    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function saveBug(bugToSave, loggedinUser) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        if (idx === -1) return Promise.reject(`Bug ${bugToSave._id} not found`)
        if (!_isAllowed(bugs[idx], loggedinUser)) return Promise.reject(NOT_ALLOWED)

        // The creator stays the original one, even when an admin edits the bug
        bugs[idx] = { ...bugs[idx], ...bugToSave, creator: bugs[idx].creator }
        bugToSave = bugs[idx]
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.creator = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile()
        .then(() => bugToSave)
}

// Only the bug's creator or an admin may change it
function _isAllowed(bug, loggedinUser) {
    return loggedinUser.isAdmin || (bug.creator && bug.creator._id === loggedinUser._id)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('data/bug.json', bugs)
}
