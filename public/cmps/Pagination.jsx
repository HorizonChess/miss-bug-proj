const PAGE_SIZE = 3

export function Pagination({ pageCount, filterBy, onSetFilterBy }) {
    // Paging is on whenever the filter has a pageIdx
    const isPaginationOn = filterBy.pageIdx !== undefined

    function onTogglePagination() {
        if (isPaginationOn) onSetFilterBy({ pageIdx: undefined })
        else onSetFilterBy({ pageIdx: 0, pageSize: PAGE_SIZE })
    }

    function onPage(diff) {
        const pageIdx = filterBy.pageIdx + diff
        onSetFilterBy({ pageIdx })
    }

    return (
        <section className="pagination">
            <label>
                <input type="checkbox" checked={isPaginationOn} onChange={onTogglePagination} />
                Pagination
            </label>

            {isPaginationOn && <React.Fragment>
                <button disabled={filterBy.pageIdx === 0} onClick={() => onPage(-1)}>Prev</button>
                <span>{pageCount ? filterBy.pageIdx + 1 : 0} / {pageCount}</span>
                <button disabled={filterBy.pageIdx >= pageCount - 1} onClick={() => onPage(1)}>Next</button>
            </React.Fragment>}
        </section>
    )
}
