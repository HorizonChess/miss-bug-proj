const { Link } = ReactRouterDOM

export function UserList({ users, onRemoveUser }) {
    if (!users) return <div>Loading...</div>

    return (
        <ul className="user-list">
            {users.map(user => (
                <li key={user._id}>
                    <p className="fullname">{user.fullname}</p>
                    <section className="actions">
                        <button><Link to={`/user/${user._id}`}>Details</Link></button>
                        <button onClick={() => onRemoveUser(user._id)}>x</button>
                    </section>
                </li>
            ))}
        </ul>
    )
}
