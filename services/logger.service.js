import fs from 'fs'

export const loggerService = {
    debug(...args) {
        doLog('DEBUG', ...args)
    },
    info(...args) {
        doLog('INFO', ...args)
    },
    warn(...args) {
        doLog('WARN', ...args)
    },
    error(...args) {
        doLog('ERROR', ...args)
    }
}

const logsDir = './logs'
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

function isError(e) {
    return e && e.stack && e.message
}

function doLog(level, ...args) {
    const strs = args.map(arg =>
        (typeof arg === 'string' || isError(arg)) ? arg : JSON.stringify(arg)
    )

    const line = `${new Date().toLocaleString()} - ${level} - ${strs.join(' | ')}\n`
    console.log(line)
    fs.appendFile(`${logsDir}/backend.log`, line, err => {
        if (err) console.log('FATAL: cannot write to log file')
    })
}
