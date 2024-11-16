const { Link } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    const user = userService.getLoggedinUser()

    function isAllowed(bug) {
        console.log(bug)
        if (user.isAdmin) return true
        if (!user) return false
        if (user._id !== bug.owner._id) return false

        return true
    }

    if (!bugs) return <div>Loading...</div>
    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    {isAllowed(bug) && <div>
                        <button onClick={() => onRemoveBug(bug._id)}>x</button>
                        <button onClick={() => onEditBug(bug)}>Edit</button>
                    </div>}
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                </li>
            ))
            }
        </ul >
    )
}
