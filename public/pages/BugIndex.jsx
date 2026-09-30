const { useState, useEffect } = React

import { bugService } from '../services/bug.service.js'
import { authService } from '../services/auth.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { Pagination } from '../cmps/Pagination.jsx'

export function BugIndex() {
    const loggedinUser = authService.getLoggedinUser()

    const [bugs, setBugs] = useState(null)
    const [pageCount, setPageCount] = useState()
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(loadBugs, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(res => {
                setBugs(res.bugs)
                setPageCount(res.pageCount)
            })
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            description: prompt('Bug description?', ''),
            severity: +prompt('Bug severity?', 3)
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([savedBug, ...bugs])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        if (!severity || severity === bug.severity) return

        const bugToSave = { ...bug, severity }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => {
            const newFilter = { ...prevFilter, ...filterBy }
            // A filter/sort change (not a page change) goes back to the first page
            if (!('pageIdx' in filterBy) && prevFilter.pageIdx !== undefined) newFilter.pageIdx = 0
            return newFilter
        })
    }

    return <section className="bug-index main-content">
        
        <header>
            <h2>Bug List</h2>
            {loggedinUser && <button onClick={onAddBug}>Add Bug</button>}
        </header>
        
        <BugFilter 
            filterBy={filterBy} 
            onSetFilterBy={onSetFilterBy} />

        <BugList 
            bugs={bugs} 
            onRemoveBug={onRemoveBug} 
            onEditBug={onEditBug} />

        <Pagination
            pageCount={pageCount}
            filterBy={filterBy}
            onSetFilterBy={onSetFilterBy} />
    </section>
}
