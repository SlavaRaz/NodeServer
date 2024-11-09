
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

_createBugs()

export const bugService = {
    query,
    getById,
    remove,
    save,
    getDefaultFilter,
    getFilterFromSearchParams
}

function query(filterBy = {}) {
    console.log('filterby', { params: filterBy })
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }

            // if (filterBy.labels)
            //     bugs = bugs.filter(bug =>
            //         filterBy.labels.some(label => bug.labels.includes(label)))

            // const sortedBugs = filteredBugs.sort((a, b) => {
            //     const direction = filterBy.sortDir
            //     if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -1 * direction
            //     if (a[filterBy.sortBy] > b[filterBy.sortBy]) return 1 * direction
            // })

            return bugs
        })
}


function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    // return axios.get(BASE_URL + bugId + '/remove')
    // .then(res => res.data)
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}

function save(car) {
    if (car._id) {
        return axios.put(BASE_URL + car._id, car)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })

    } else {
        return axios.post(BASE_URL, car)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })
    }
}

function getDefaultFilter() {
    return { txt: '', severity: '', pageIdx: 0, labels: '', sortBy: '', sortDir: 1 }
}


function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
    const severity = searchParams.get('severity') || ''
    return {
        txt,
        severity
    }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }
}
