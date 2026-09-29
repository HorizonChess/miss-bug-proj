export function LabelChooser({ labels, selectedLabels, onChangeLabels }) {

    function onToggleLabel(label) {
        const labelsToSave = selectedLabels.includes(label)
            ? selectedLabels.filter(currLabel => currLabel !== label)
            : [...selectedLabels, label]

        onChangeLabels(labelsToSave)
    }

    return (
        <section className="label-chooser">
            {labels.map(label =>
                <label key={label}>
                    <input
                        type="checkbox"
                        checked={selectedLabels.includes(label)}
                        onChange={() => onToggleLabel(label)} />
                    {label}
                </label>
            )}
        </section>
    )
}
