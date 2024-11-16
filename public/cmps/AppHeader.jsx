const { useState } = React

const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'

export function AppHeader() {
	const navigate = useNavigate()
	const [user, setUser] = useState(userService.getLoggedinUser())

	function onLogout() {
		userService.logout()
            .then(() => onSetUser(null))
            .catch(err => showErrorMsg('OOPs try again'))
	}

	function onSetUser(user) {
		setUser(user)
        navigate('/')
	}

	return (
		<header className="app-header full main-layout">
			<section className="header-container">
				<h1>React Bug App</h1>
				<nav className="app-nav">
					<NavLink to="/">Home</NavLink>
					<NavLink to="/about">About</NavLink>
					<NavLink to="/bug">Bugs</NavLink>
				</nav>
			</section>
            
			{user ? (
				<section>
					<Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
					<button onClick={onLogout}>Logout</button>
				</section>
			) : (
				<section>
					<LoginSignup onSetUser={onSetUser} />
				</section>
			)}
			<UserMsg />
		</header>
	)
}
