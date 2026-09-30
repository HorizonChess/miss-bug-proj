export function BugPreview({bug}) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        {bug.creator && <p>By: <span>{bug.creator.fullname}</span></p>}
    </article>
}