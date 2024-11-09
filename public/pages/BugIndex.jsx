import { BugFilter } from "../cmps/BugFilter.jsx"
import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(bugs => setBugs(bugs))
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveBug(bugId) {
        console.log(bugId)
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const description = prompt('Edit Desctiption', bug._id ? bug.description : '')
        const bugToSave = { ...bug, description }
        console.log(bugToSave)
        bugService.save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onChangePageIdx(diff) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }    

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                <button onClick={() => { onChangePageIdx(1) }}>+</button>
                {filterBy.pageIdx + 1 || ''}
                <button onClick={() => { onChangePageIdx(-1) }} disabled={filterBy.pageIdx === 0}>-</button>
            </section>
            <main>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
