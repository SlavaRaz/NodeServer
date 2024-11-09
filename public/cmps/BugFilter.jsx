import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 1000))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { txt, severity, labels, sortBy, sortDir } = filterByToEdit

    return (
        <section className="car-filter">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Title</label>
                <input value={txt} onChange={handleChange} name="txt" type="text" id="txt" />

                <label htmlFor="severity">Severity</label>
                <input value={severity} onChange={handleChange} name="severity" type="number" id="severity" />

                <label htmlFor="labels">Labels</label>
                <input value={labels} onChange={handleChange} name="labels" type="text" id="labels" />

                <label htmlFor="sortBy">SortBy</label>
                <input value={sortBy} onChange={handleChange} name="sortBy" type="text" id="sortBy" />

                <button>Submit</button>
            </form>
        </section>
    )
}