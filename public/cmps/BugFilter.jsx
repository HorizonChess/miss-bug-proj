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

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, minSeverity, labels } = filterByToEdit
    return (
        <form className="bug-filter" onSubmit={onSubmitFilter}>
            <p>Filter</p>

            <label htmlFor="txt">Text: </label>
            <input value={txt} onChange={handleChange} type="text" placeholder="Search title / desc." id="txt" name="txt" />

            <label htmlFor="minSeverity">Min Severity: </label>
            <input value={minSeverity || ''} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

            <LabelChooser
                labels={bugService.getLabels()}
                selectedLabels={labels}
                onChangeLabels={onChangeLabels} />
        </form>
    )
}