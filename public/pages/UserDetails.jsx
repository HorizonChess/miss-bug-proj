const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

import { BugList } from '../cmps/BugList.jsx'

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)

    const { userId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadBugs()
    }, [userId])

    function loadUser() {
        userService.getById(userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('User not found')
                navigate('/')
            })
    }

    // Reuses the bug list query, filtered by creator
    function loadBugs() {
        bugService.query({ creatorId: userId })
            .then(res => setBugs(res.bugs))
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                setBugs(bugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch(err => showErrorMsg('Cannot remove bug', err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        if (!severity || severity === bug.severity) return

        bugService.save({ ...bug, severity })
            .then(savedBug => {
                setBugs(bugs.map(currBug => currBug._id === savedBug._id ? savedBug : currBug))
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    if (!user) return <div className="main-content">Loading...</div>
    return (
        <section className="user-details main-content">
            <h2>{user.fullname}</h2>
            <p>Username: {user.username}{user.isAdmin && ' (admin)'}</p>

            <h3>Bugs by {user.fullname}</h3>
            {bugs && !bugs.length && <p>No bugs yet</p>}
            {bugs && bugs.length > 0 &&
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />}

            <button onClick={() => navigate('/bug')}>Back to bugs</button>
        </section>
    )
}
