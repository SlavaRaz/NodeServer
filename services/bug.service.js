import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bugs.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {

    if (bugToSave._id) {
        const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id)
        bugToSave = {
            _id: bugToSave._id,
            title: bugToSave.title,
            severity: bugToSave.severity,
            description: bugToSave.description,
            updatedAt: Date.now()
        }
        bugs[bugIdx].title = bugToSave.title
        bugs[bugIdx].severity = bugToSave.severity
        bugs[bugIdx].description = bugToSave.description
        bugs[bugIdx].updatedAt = bugToSave.updatedAt

        bugToSave=bugs[bugIdx]
        
    } else {
        bugToSave = {
            _id: utilService.makeId(),
            title: bugToSave.title,
            severity: bugToSave.severity,
            description: bugToSave.description,
            updatedAt: Date.now(),
            createdAt: Date.now(),
        }
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}