const { useState } = React
const { useNavigate } = ReactRouter

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { authService } from '../services/auth.service.js'

export function LoginSignup({ setLoggedinUser }) {
    const [isSignup, setIsSignup] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    const navigate = useNavigate()

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        const action = isSignup ? authService.signup : authService.login

        action(credentials)
            .then(user => {
                setLoggedinUser(user)
                showSuccessMsg(isSignup ? 'Signed up successfully' : 'Logged in successfully')
                navigate('/bug')
            })
            .catch(err => {
                console.log(err)
                showErrorMsg(isSignup ? `Couldn't signup` : `Couldn't login`)
            })
    }

    return (
        <section className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <input type="text" name="username" value={credentials.username}
                    placeholder="Username" onChange={handleChange} required autoFocus />
                <input type="password" name="password" value={credentials.password}
                    placeholder="Password" onChange={handleChange} required autoComplete="off" />
                {isSignup && <input type="text" name="fullname" value={credentials.fullname}
                    placeholder="Full name" onChange={handleChange} required />}

                <button>{isSignup ? 'Signup' : 'Login'}</button>

                <button type="button" className="btn-toggle" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? 'Already a member? Login' : 'New user? Signup here'}
                </button>
            </form>
        </section>
    )
}
