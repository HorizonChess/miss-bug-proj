const { useState, useEffect } = React

import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

import { UserList } from '../cmps/UserList.jsx'

export function UserIndex() {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => showErrorMsg(`Couldn't load users`, err))
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                setUsers(users.filter(user => user._id !== userId))
                showSuccessMsg('User deleted')
            })
            // The server explains why (e.g. the user still owns bugs)
            .catch(err => showErrorMsg(err.response ? err.response.data : 'Cannot delete user'))
    }

    return (
        <section className="user-index main-content">
            <h2>Users</h2>
            <UserList users={users} onRemoveUser={onRemoveUser} />
        </section>
    )
}
