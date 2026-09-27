import fs from 'fs'

export const utilService = {
    readJsonFile,
    writeJsonFile,
    makeId
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    return JSON.parse(str)
}

function writeJsonFile(path, data) {
    return new Promise((resolve, reject) => {
        const str = JSON.stringify(data, null, 2)
        fs.writeFile(path, str, err => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function makeId(length = 5) {
    let txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
