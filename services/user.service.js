import { utilService } from './util.service.js'

export const userService = {
    query,
    getUserById,
    getByUsername,
    addUser,
    removeUser
}

const users = utilService.readJsonFile('data/user.json')

// The list only exposes public details
function query() {
    const usersToReturn = users.map(user => ({ _id: user._id, fullname: user.fullname }))
    return Promise.resolve(usersToReturn)
}

function getUserById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(_withoutPassword(user))
}

// Internal use (login): returns the full user, password included
function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function addUser({ username, password, fullname }) {
    return getByUsername(username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            const user = { _id: utilService.makeId(), username, password, fullname }
            users.push(user)
            return _saveUsersToFile().then(() => _withoutPassword(user))
        })
}

function removeUser(userId) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject(`User ${userId} not found`)

    users.splice(idx, 1)
    return _saveUsersToFile()
}

function _withoutPassword(user) {
    const { password, ...userToReturn } = user
    return userToReturn
}

function _saveUsersToFile() {
    return utilService.writeJsonFile('data/user.json', users)
}
