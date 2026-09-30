const { useState, useEffect } = React

import { bugService } from '../services/bug.service.js'
import { LabelChooser } from './LabelChooser.jsx'

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break

            case 'checkbox':
                value = target.checked
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onChangeLabels(labels) {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, labels }))
    }

    function onToggleSortDir({ target }) {
        const sortDir = target.checked ? -1 : 1
        setFilterByToEdit(prevFilter => ({ ...prevFilter, sortDir }))
    }

    function onClearFilter() {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, txt: '', minSeverity: 0, labels: [] }))
    }

    function onClearSort() {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, sortField: '', sortDir: 1 }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, minSeverity, labels, sortField, sortDir } = filterByToEdit
    return (
        <form className="bug-filter" onSubmit={onSubmitFilter}>
            <p>Filter</p>

            <label htmlFor="txt">Text: </label>
            <input value={txt} onChange={handleChange} type="text" placeholder="Search title / desc." id="txt" name="txt" />

            <label htmlFor="minSeverity">Min Severity: </label>
            <input value={minSeverity || ''} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

            <button type="button" onClick={onClearFilter}>Clear Filter</button>

            <LabelChooser
                labels={bugService.getLabels()}
                selectedLabels={labels}
                onChangeLabels={onChangeLabels} />

            <div className="sort-by">
                <label htmlFor="sortField">Sort by: </label>
                <select value={sortField} onChange={handleChange} id="sortField" name="sortField">
                    <option value="">None</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created</option>
                </select>

                <label>
                    <input type="checkbox" checked={sortDir === -1} onChange={onToggleSortDir} disabled={!sortField} />
                    Descending
                </label>

                <button type="button" onClick={onClearSort}>Clear Sort</button>
            </div>
        </form>
    )
}