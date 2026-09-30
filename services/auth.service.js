import Cryptr from 'cryptr'
import { userService } from './user.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')

export const authService = {
    checkLogin,
    getLoginToken,
    validateToken
}

function checkLogin({ username, password }) {
    return userService.getByUsername(username)
        .then(user => {
            if (!user || user.password !== password) return Promise.reject('Invalid username or password')
            return _getMiniUser(user)
        })
}

// The token is the encrypted mini-user: the browser holds it, but can't read or forge it
function getLoginToken(user) {
    const str = JSON.stringify(_getMiniUser(user))
    return cryptr.encrypt(str)
}

function validateToken(token) {
    if (!token) return null
    try {
        const str = cryptr.decrypt(token)
        return JSON.parse(str)
    } catch (err) {
        // A tampered or foreign token: treat as logged out
        return null
    }
}

function _getMiniUser({ _id, fullname, isAdmin }) {
    const miniUser = { _id, fullname }
    if (isAdmin) miniUser.isAdmin = true
    return miniUser
}
